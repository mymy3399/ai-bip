export function ModulePlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <section className="placeholder-page">
      <p className="section-kicker">MODULE</p>
      <h2>{title}</h2>
      <p>{description}</p>
      <span className="placeholder-status">กำลังเปิดพื้นที่จำลอง</span>
    </section>
  )
}
