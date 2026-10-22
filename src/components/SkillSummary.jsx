// Ringkasan jumlah data skill
function SkillSummary({ totalSkill, totalKategori, totalFavorit }) {
  const stats = [
    { label: 'Total Skill', value: totalSkill },
    { label: 'Kategori', value: totalKategori },
    { label: 'Total Favorit', value: totalFavorit },
  ]

  return (
    <section className="grid grid-cols-3 gap-3">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded border border-neutral-800 p-4">
          <p className="text-xs text-neutral-400">{stat.label}</p>
          <p className="mt-1 text-2xl font-semibold text-neutral-100">{stat.value}</p>
        </div>
      ))}
    </section>
  )
}

export default SkillSummary
