export function SectionHeading({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-2xl space-y-3">
      <p className="text-sm uppercase tracking-[0.35em] text-stone">{eyebrow}</p>
      <h2 className="font-serif text-4xl text-ink md:text-5xl">{title}</h2>
      <p className="text-base leading-7 text-stone">{description}</p>
    </div>
  );
}
