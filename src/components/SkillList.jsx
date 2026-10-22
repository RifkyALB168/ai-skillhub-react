import SkillCard from './SkillCard'

// Daftar skill, memakai SkillCard untuk tiap item
function SkillList({ skills, onDelete }) {
  // Conditional rendering: tampilkan pesan jika daftar kosong
  if (skills.length === 0) {
    return (
      <p className="rounded border border-dashed border-neutral-800 px-4 py-10 text-center text-neutral-400">
        Belum ada data Skill
      </p>
    )
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {skills.map((skill) => (
        <SkillCard
          key={skill.id}
          name={skill.name}
          description={skill.description}
          category={skill.category}
          platform={skill.platform}
          author={skill.author}
          favs={skill.favs}
          onDelete={() => onDelete(skill.id)}
        />
      ))}
    </div>
  )
}

export default SkillList
