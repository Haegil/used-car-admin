import Icon from './Icon'

function Modal({ title, children, onClose, maxWidth = 'max-w-lg' }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6">
      <section
        className={`max-h-[calc(100vh-48px)] w-full ${maxWidth} overflow-y-auto rounded-sm bg-white shadow-xl`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modalTitle"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <h2 id="modalTitle" className="text-lg font-bold text-slate-950">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-sm text-slate-500 hover:bg-slate-100 hover:text-slate-950"
            aria-label="닫기"
          >
            <Icon name="close" />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </section>
    </div>
  )
}

export default Modal
