// Header: logo dan judul aplikasi
function Header({ title, subtitle }) {
  return (
    <header className="border-b border-neutral-800">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-4">
        <img src="/logo.svg" alt="" width="28" height="28" />
        <div>
          <h1 className="text-base font-semibold text-neutral-100">{title}</h1>
          <p className="text-xs text-neutral-400">{subtitle}</p>
        </div>
      </div>
    </header>
  )
}

export default Header
