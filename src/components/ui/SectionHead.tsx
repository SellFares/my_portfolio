type Props = {
  index: string;
  label: string;
  lead: string;
  accent: string;
  id?: string;
  /** Optional extra line break after `lead` */
  breakAfterLead?: boolean;
};

/** Mono index + label, then a heading that ends in one serif-italic word. */
export default function SectionHead({ index, label, lead, accent, id, breakAfterLead }: Props) {
  return (
    <header>
      <p className="tag rv">
        <b>{index}</b>
        <i aria-hidden />
        <span>{label}</span>
      </p>
      <h2 className="h2" id={id}>
        {breakAfterLead ? (
          <>
            <span className="rv-mask"><span className="rv-in">{lead}</span></span>
            <span className="rv-mask" style={{ ["--i" as string]: 1 }}>
              <span className="rv-in"><span className="accent">{accent}</span></span>
            </span>
          </>
        ) : (
          <span className="rv-mask">
            <span className="rv-in">
              {lead} <span className="accent">{accent}</span>
            </span>
          </span>
        )}
      </h2>
    </header>
  );
}
