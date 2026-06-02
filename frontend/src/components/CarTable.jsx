import Icon from './Icon'

function CarTable({ cars, onSelect, onEdit, onDelete }) {
  return (
    <div className="overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm">
      <div className="hidden grid-cols-[72px_minmax(150px,1fr)_112px_128px_80px_150px] border-b border-slate-200 bg-slate-100 px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500 lg:grid">
        <span>ID</span>
        <span>차량명</span>
        <span>가격</span>
        <span>제조사</span>
        <span>연식</span>
        <span>관리</span>
      </div>

      <div className="divide-y divide-slate-200">
        {cars.map((car) => (
          <div key={car._id} className="grid gap-3 p-4 lg:grid-cols-[72px_minmax(150px,1fr)_112px_128px_80px_150px] lg:items-center">
            <button
              type="button"
              onClick={() => onSelect(car._id)}
              className="grid min-w-0 gap-2 text-left lg:contents"
            >
              <span className="text-sm font-semibold text-slate-500 lg:font-normal">#{car._id}</span>
              <span className="truncate text-base font-semibold text-slate-950 lg:text-sm">{car.name}</span>
              <span className="text-sm text-slate-700">{car.price.toLocaleString()}만원</span>
              <span className="w-fit rounded-sm bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                {car.company}
              </span>
              <span className="text-sm text-slate-700">{car.year}</span>
            </button>

            <div className="grid grid-cols-2 gap-2 sm:flex lg:justify-end">
              <button
                type="button"
                onClick={() => onEdit(car)}
                className="inline-flex h-9 min-w-[68px] items-center justify-center gap-1 whitespace-nowrap rounded-sm border border-slate-300 px-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                <Icon name="edit" />
                수정
              </button>
              <button
                type="button"
                onClick={() => onDelete(car)}
                className="inline-flex h-9 min-w-[68px] items-center justify-center gap-1 whitespace-nowrap rounded-sm border border-red-200 px-3 text-sm font-medium text-red-700 hover:bg-red-50"
              >
                <Icon name="delete" />
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>

      {cars.length === 0 && (
        <div className="px-4 py-10 text-center text-sm text-slate-500">
          조건에 맞는 차량이 없습니다.
        </div>
      )}
    </div>
  )
}

export default CarTable
