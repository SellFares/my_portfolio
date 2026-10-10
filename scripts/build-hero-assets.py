#!/usr/bin/env python3
"""
Build the seamless looping hero clip, portrait still and OG image.

Usage:
  python3 scripts/build-hero-assets.py --video path/to/intro.mp4 [--photo path/to/photo.jpg]
        [--crop W:H:X:Y] [--portrait-box X:Y:W:H] [--loop-seconds 10] [--xfade 0.5]

Requires: ffmpeg (libx264, libvpx-vp9, libopus), numpy, Pillow.
Optional: fonttools + brotli (only to render the OG image with Inter Tight).

Pipeline
  1. Detect the person (bbox of non-white pixels on sampled frames) and crop
     around them, head to toe, centred. Override with --crop W:H:X:Y.
  2. Scale to 768 px wide and whiten the backdrop (colorlevels).
  3. Seamless loop: the last XFADE seconds of the clip are cross-faded into the
     first XFADE seconds. Loop length = LOOP - XFADE. Video via ffmpeg xfade,
     audio via an equal-power cross-fade done sample-accurately in numpy
     (never ffmpeg acrossfade, which can drop audio). Nothing is retimed, so
     lips stay in sync.
  4. Export hero.mp4 (H.264 CRF 24 + AAC 96k, +faststart) and
     hero.webm (VP9 CRF 36 + Opus 80k) to public/hero/.
  5. Export portrait-bust.webp (480x600) and og.jpg (1200x630) to public/.
"""
import argparse, os, subprocess, sys, tempfile, wave
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_HERO = os.path.join(ROOT, "public", "hero")
OUT_PUB = os.path.join(ROOT, "public")


def run(cmd, **kw):
    print("+", " ".join(cmd))
    subprocess.run(cmd, check=True, **kw)


def probe(path):
    out = subprocess.check_output(
        ["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
         "stream=width,height,r_frame_rate", "-show_entries", "format=duration",
         "-of", "default=nw=1:nk=1", path]).decode().split()
    w, h = int(out[0]), int(out[1])
    num, den = out[2].split("/")
    return w, h, float(num) / float(den), float(out[3])


def detect_crop(path, w, h, duration):
    """Bounding box of non-white pixels over sampled frames -> centred 4:5 crop."""
    xs0, xs1, ys0, ys1 = [], [], [], []
    for t in np.linspace(0.3, max(duration - 0.3, 0.4), 6):
        raw = subprocess.check_output(
            ["ffmpeg", "-v", "error", "-ss", f"{t:.2f}", "-i", path, "-frames:v", "1",
             "-vf", "scale=480:-1,format=gray", "-f", "rawvideo", "-"])
        sw = 480
        sh = len(raw) // sw
        g = np.frombuffer(raw, np.uint8).reshape(sh, sw)
        mask = g < 215
        cols = np.where(mask.sum(0) > 2)[0]
        rows = np.where(mask.sum(1) > 2)[0]
        if len(cols) and len(rows):
            k = w / sw
            xs0.append(cols[0] * k); xs1.append(cols[-1] * k)
            ys0.append(rows[0] * k); ys1.append(rows[-1] * k)
    cx = (np.median(xs0) + np.median(xs1)) / 2
    top, bot = np.min(ys0), np.max(ys1)
    ch = min(h, int((bot - top) * 1.04) + 8)
    ch = max(ch, int(h * 0.9))
    cw = int(ch * 768 / 960)
    x = int(np.clip(cx - cw / 2, 0, w - cw))
    y = int(np.clip(top - 0.02 * ch, 0, h - ch))
    print(f"detected person bbox -> crop={cw}:{ch}:{x}:{y}")
    return cw, ch, x, y


def read_pcm(path, seconds):
    raw = subprocess.check_output(
        ["ffmpeg", "-v", "error", "-i", path, "-t", str(seconds), "-vn", "-ac", "2",
         "-ar", "48000", "-f", "f32le", "-"])
    return np.frombuffer(raw, np.float32).reshape(-1, 2), 48000


def write_wav(path, data, sr):
    pcm = (np.clip(data, -1, 1) * 32767).astype("<i2")
    with wave.open(path, "wb") as f:
        f.setnchannels(2); f.setsampwidth(2); f.setframerate(sr)
        f.writeframes(pcm.tobytes())


def make_audio_loop(src, loop, xf, out_wav):
    a, sr = read_pcm(src, loop)
    total = int(round(loop * sr))
    n = int(round(xf * sr))
    a = a[:total]
    if len(a) < total:
        a = np.pad(a, ((0, total - len(a)), (0, 0)))
    tail, head = a[total - n:], a[:n]
    t = np.linspace(0, 1, n, endpoint=False)[:, None]
    # equal-power cross-fade: tail fades out, head fades in
    mix = tail * np.cos(t * np.pi / 2) + head * np.sin(t * np.pi / 2)
    # loop = [mix (n)] + a[n : total - n]  -> length total - n
    # wrap check: ...a[total-n-1] -> mix[0] ~ a[total-n] (continuous)
    #             mix[n-1] ~ a[n-1]-> a[n] (continuous)
    body = a[n:total - n]
    loop_audio = np.concatenate([mix, body], axis=0)
    write_wav(out_wav, loop_audio, sr)
    print(f"audio loop: {len(loop_audio)/sr:.3f}s")


def build_video(src, crop, loop, xf, fps, out_mp4, out_webm, wav, tmp):
    cw, ch, x, y = crop
    L, X = loop, xf
    body_end = L - X
    # video loop = xfade(tail[L-X..L], head[0..X]) + body[X .. L-X]
    fc = (
        f"[0:v]crop={cw}:{ch}:{x}:{y},scale=768:-2:flags=lanczos,"
        f"colorlevels=rimax=0.98:gimax=0.98:bimax=0.98,fps={fps},split=3[a][b][c];"
        f"[a]trim=start={L-X}:end={L},setpts=PTS-STARTPTS[tail];"
        f"[b]trim=start=0:end={X},setpts=PTS-STARTPTS[head];"
        f"[c]trim=start={X}:end={body_end},setpts=PTS-STARTPTS[body];"
        f"[tail][head]xfade=transition=fade:duration={X}:offset=0[mix];"
        f"[mix][body]concat=n=2:v=1:a=0,format=yuv420p[v]"
    )
    silent = os.path.join(tmp, "loop_silent.mp4")
    run(["ffmpeg", "-v", "error", "-y", "-i", src, "-filter_complex", fc, "-map", "[v]",
         "-an", "-c:v", "libx264", "-crf", "12", "-preset", "fast", "-pix_fmt", "yuv420p", silent])
    run(["ffmpeg", "-v", "error", "-y", "-i", silent, "-i", wav, "-map", "0:v", "-map", "1:a",
         "-c:v", "libx264", "-crf", "24", "-preset", "slow", "-pix_fmt", "yuv420p",
         "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", "-shortest", out_mp4])
    run(["ffmpeg", "-v", "error", "-y", "-i", silent, "-i", wav, "-map", "0:v", "-map", "1:a",
         "-c:v", "libvpx-vp9", "-crf", "36", "-b:v", "0", "-row-mt", "1",
         "-c:a", "libopus", "-b:a", "80k", "-shortest", out_webm])
    return silent


def build_portrait(photo, box, out_webp):
    from PIL import Image
    im = Image.open(photo).convert("RGB")
    x, y, w, h = box
    im = im.crop((x, y, x + w, y + h)).resize((480, 600), Image.LANCZOS)
    im.save(out_webp, "WEBP", quality=86, method=6)
    return im


def get_font(size):
    from PIL import ImageFont
    try:
        from fontTools.ttLib import TTFont
        from fontTools.varLib import instancer
        src = os.path.join(ROOT, "src", "fonts", "InterTight-Variable.woff2")
        f = TTFont(src)
        inst = instancer.instantiateVariableFont(f, {"wght": 700})
        inst.flavor = None
        p = os.path.join(tempfile.gettempdir(), "InterTight-700.ttf")
        inst.save(p)
        return ImageFont.truetype(p, size)
    except Exception as e:  # fall back to a system font
        print("OG font fallback:", e)
        for p in ("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",):
            if os.path.exists(p):
                return ImageFont.truetype(p, size)
        return ImageFont.load_default()


def build_og(portrait, name, role, out_jpg):
    from PIL import Image, ImageDraw
    paper = (244, 242, 238)
    og = Image.new("RGB", (1200, 630), paper)
    p = portrait.resize((420, 525))
    og.paste(p, (1200 - 420 - 70, 52))
    d = ImageDraw.Draw(og)
    d.text((70, 210), name, font=get_font(84), fill=(13, 13, 13))
    d.text((72, 330), role, font=get_font(34), fill=(119, 117, 111))
    og.save(out_jpg, "JPEG", quality=88)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--video", required=True)
    ap.add_argument("--photo")
    ap.add_argument("--crop", help="W:H:X:Y crop in source pixels")
    ap.add_argument("--portrait-box", help="X:Y:W:H crop of the photo (4:5)")
    ap.add_argument("--loop-seconds", type=float, default=10.0)
    ap.add_argument("--xfade", type=float, default=0.5)
    ap.add_argument("--name", default="Sellami Fares")
    ap.add_argument("--role", default="Full Stack Developer")
    a = ap.parse_args()

    os.makedirs(OUT_HERO, exist_ok=True)
    w, h, fps, dur = probe(a.video)
    loop = min(a.loop_seconds, dur)
    crop = tuple(int(v) for v in a.crop.split(":")) if a.crop else detect_crop(a.video, w, h, dur)
    fps = round(fps)

    with tempfile.TemporaryDirectory() as tmp:
        wav = os.path.join(tmp, "loop.wav")
        make_audio_loop(a.video, loop, a.xfade, wav)
        silent = build_video(a.video, crop, loop, a.xfade, fps,
                             os.path.join(OUT_HERO, "hero.mp4"),
                             os.path.join(OUT_HERO, "hero.webm"), wav, tmp)
        # poster / portrait fallback frame (clearest frame, mid-clip)
        frame = os.path.join(tmp, "frame.png")
        run(["ffmpeg", "-v", "error", "-y", "-ss", "3", "-i", silent, "-frames:v", "1", frame])
        run(["ffmpeg", "-v", "error", "-y", "-i", frame, "-quality", "80",
             os.path.join(OUT_HERO, "poster.webp")])

        from PIL import Image
        if a.photo:
            box = tuple(int(v) for v in a.portrait_box.split(":")) if a.portrait_box else None
            if box is None:
                im = Image.open(a.photo); iw, ih = im.size
                bw = int(iw * 0.56); bh = int(bw * 1.25)
                box = (int(iw * 0.5 - bw / 2 - iw * 0.02), int(ih * 0.405), bw, bh)
            portrait = build_portrait(a.photo, box, os.path.join(OUT_PUB, "portrait-bust.webp"))
        else:
            fr = Image.open(frame).convert("RGB"); fw, fh = fr.size
            bw = int(fw * 0.62); bh = int(bw * 1.25)
            portrait = fr.crop((int((fw - bw) / 2), 0, int((fw + bw) / 2), bh)).resize((480, 600))
            portrait.save(os.path.join(OUT_PUB, "portrait-bust.webp"), "WEBP", quality=86)
        build_og(portrait, a.name, a.role, os.path.join(OUT_PUB, "og.jpg"))
    print("done.")


if __name__ == "__main__":
    sys.exit(main())
