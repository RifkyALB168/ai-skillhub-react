import SkillCard from './SkillCard'

function SkillList({ skills, onDelete, onEdit, busy }) {
  if (skills.length === 0) {
    return <p className="rounded border border-dashed border-neutral-800 px-4 py-10 text-center text-neutral-400">Belum ada data Skill</p>
  }
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {skills.map((skill) => (
        <SkillCard key={skill.id} {...skill} busy={busy} onDelete={() => onDelete(skill.id)} onEdit={() => onEdit(skill)} />
      ))}
    </div>
  )
}

export default SkillList
