import Icon from './Icon'

function CarForm({ form, editingId, onChange, onSubmit, onCancel }) {
  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-1">
        <label className="text-sm font-medium text-slate-700" htmlFor="name">
          차량명
        </label>
        <input
          id="name"
          name="name"
          value={form.name}
          onChange={onChange}
          className="h-11 w-full min-w-0 rounded-sm border border-slate-300 px-3 text-sm outline-none focus:border-slate-900"
          placeholder="Sonata"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="grid gap-1">
          <label className="text-sm font-medium text-slate-700" htmlFor="price">
            가격
          </label>
          <input
            id="price"
            name="price"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={form.price}
            onChange={onChange}
            className="h-11 w-full min-w-0 rounded-sm border border-slate-300 px-3 text-sm outline-none focus:border-slate-900"
            placeholder="2500"
          />
        </div>

        <div className="grid gap-1">
          <label className="text-sm font-medium text-slate-700" htmlFor="company">
            제조사
          </label>
          <input
            id="company"
            name="company"
            value={form.company}
            onChange={onChange}
            className="h-11 w-full min-w-0 rounded-sm border border-slate-300 px-3 text-sm uppercase outline-none focus:border-slate-900"
            placeholder="HYUNDAI"
          />
        </div>

        <div className="grid gap-1">
          <label className="text-sm font-medium text-slate-700" htmlFor="year">
            연식
          </label>
          <input
            id="year"
            name="year"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={form.year}
            onChange={onChange}
            className="h-11 w-full min-w-0 rounded-sm border border-slate-300 px-3 text-sm outline-none focus:border-slate-900"
            placeholder="2024"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-sm bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-700">
          <Icon name={editingId ? 'edit' : 'add'} />
          {editingId ? '수정 저장' : '차량 등록'}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-sm border border-slate-300 px-4 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            <Icon name="close" />
            취소
          </button>
        )}
      </div>
    </form>
  )
}

export default CarForm
