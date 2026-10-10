import { CERTIFICATIONS } from "@/lib/data";

export default function Certifications() {
  const n = CERTIFICATIONS.length;
  return (
    <section id="certifications" className="certs" aria-labelledby="certs-h">
      <div className="wrap certs-grid">
        <div className="certs-left">
          <p className="tag rv"><b>04</b><i aria-hidden /><span>Certifications</span></p>
          <h2 className="h2" id="certs-h">
            <span className="rv-mask"><span className="rv-in">Always <span className="accent">learning.</span></span></span>
          </h2>
          <p className="certs-count mono rv">{String(n).padStart(2, "0")} courses · IBM &amp; Tarmeez Academy</p>
        </div>
        <ol className="certs-list">
          {CERTIFICATIONS.map((c, i) => (
            <li key={c.title} className="cert rv" style={{ ["--i" as string]: i % 4 }} tabIndex={0}>
              <span className="c-no mono">{String(i + 1).padStart(2, "0")}</span>
              <span className="c-t">{c.title}</span>
              <span className="c-i mono">{c.issuer}</span>
              <span className="c-arrow" aria-hidden>↗</span>
            </li>
          ))}
        </ol>
      </div>
      <style>{`
        .certs{background:var(--card);border-block:1px solid var(--line);padding-block:var(--sec-pt)}
        .certs-grid{display:grid;grid-template-columns:1fr;gap:40px}
        .certs-left{align-self:start}
        .certs-count{margin-top:22px;font-size:12px;letter-spacing:.04em;text-transform:uppercase;color:var(--mute)}
        .certs-list{border-top:1px solid var(--line)}
        .cert{position:relative;display:grid;grid-template-columns:auto minmax(0,1fr);grid-template-areas:"n t" ". i";column-gap:18px;row-gap:4px;align-items:baseline;padding:22px 18px;border-bottom:1px solid var(--line);overflow:hidden;isolation:isolate;transition:color .5s var(--ease),opacity .9s var(--ease),transform .9s var(--ease)}
        .cert::before{content:"";position:absolute;inset:0;background:var(--ink);transform:scaleX(0);transform-origin:0 50%;transition:transform .7s var(--ease);z-index:-1}
        .cert:hover::before,.cert:focus-visible::before{transform:scaleX(1)}
        .cert:hover,.cert:focus-visible{color:#fff}
        .cert:focus-visible{outline-offset:-3px;border-radius:0}
        .c-no{grid-area:n;font-size:12px;opacity:.55}
        .c-t{grid-area:t;font-size:clamp(20px,2.4vw,30px);font-weight:600;letter-spacing:-.035em;line-height:1.15;transition:transform .6s var(--ease)}
        .c-i{grid-area:i;font-size:11.5px;letter-spacing:.04em;text-transform:uppercase;opacity:.6}
        .c-arrow{position:absolute;right:20px;top:50%;font-size:22px;transform:translate(-14px,-50%);opacity:0;transition:transform .6s var(--ease),opacity .4s}
        .cert:hover .c-arrow,.cert:focus-visible .c-arrow{transform:translate(0,-50%);opacity:1}
        .cert:hover .c-t,.cert:focus-visible .c-t{transform:translateX(8px)}
        @media (min-width:900px){
          .certs-grid{grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);gap:64px}
          .certs-left{position:sticky;top:120px}
          .cert{grid-template-columns:auto minmax(0,1fr) auto;grid-template-areas:"n t i";padding-right:56px}
          .c-i{text-align:right}
        }
      `}</style>
    </section>
  );
}
