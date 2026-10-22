// Kartu untuk satu skill
function SkillCard({ name, description, category, platform, author, favs, onDelete }) {
  return (
    <article className="flex flex-col rounded border border-neutral-800 p-4">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium text-neutral-100">{name}</h3>
        <span className="shrink-0 rounded border border-neutral-700 px-1.5 font-mono text-xs text-neutral-400">
          {category}
        </span>
      </div>
      <p className="mt-2 flex-1 text-neutral-400">{description}</p>
      <div className="mt-4 flex items-center justify-between text-xs text-neutral-400">
        <span>
          {platform} · {author} · {favs} favorit
        </span>
        <button
          type="button"
          onClick={onDelete}
          className="rounded px-2 py-1 hover:bg-neutral-900 hover:text-neutral-100 focus-visible:outline-2 focus-visible:outline-neutral-100"
        >
          Hapus
        </button>
      </div>
    </article>
  )
}

export default SkillCard
