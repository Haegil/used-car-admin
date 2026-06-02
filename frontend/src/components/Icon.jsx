function Icon({ name, label }) {
  return (
    <span className="material-symbols-outlined text-[20px]" aria-hidden={!label}>
      {name}
    </span>
  )
}

export default Icon
