function SkillCard({ name, description, category, platform, author, favs, onDelete, onEdit, busy }) {
  const buttonClass = 'min-h-11 rounded px-3 py-2 hover:bg-neutral-900 hover:text-neutral-100 focus-visible:outline-2 focus-visible:outline-neutral-100 disabled:opacity-40'
  return (
    <article className="flex min-w-0 flex-col rounded border border-neutral-800 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="min-w-0 break-words font-medium text-neutral-100 [overflow-wrap:anywhere]">{name}</h3>
        <span className="rounded border border-neutral-700 px-1.5 text-xs text-neutral-400">{category}</span>
      </div>
      <p className="mt-2 flex-1 break-words text-neutral-400 [overflow-wrap:anywhere]">{description}</p>
      <p className="mt-4 break-words text-xs text-neutral-400 [overflow-wrap:anywhere]">{platform} · {author} · {favs} favorit</p>
      <div className="mt-2 flex justify-end gap-1 text-sm text-neutral-400">
        <button type="button" onClick={onEdit} disabled={busy} aria-label={`Ubah ${name}`} className={buttonClass}>Ubah</button>
        <button type="button" onClick={onDelete} disabled={busy} aria-label={`Hapus ${name}`} className={buttonClass}>Hapus</button>
      </div>
    </article>
  )
}

export default SkillCard
