export default function MediaSlot({
  children,
  className = "",
  label,
  slotId,
}) {
  return (
    <figure
      className={`public-media-slot ${className}`.trim()}
      data-media-slot={slotId}
      data-media-status="deferred"
    >
      <div className="public-media-slot__field" aria-hidden="true">
        <span className="public-media-slot__horizon" />
        <span className="public-media-slot__frame public-media-slot__frame--top" />
        <span className="public-media-slot__frame public-media-slot__frame--bottom" />
      </div>
      <figcaption className="public-media-slot__caption">
        <span className="public-media-slot__eyebrow">Media reserved</span>
        <span>{label}</span>
        <small>Verified cockpit capture pending</small>
      </figcaption>
      {children}
    </figure>
  );
}
