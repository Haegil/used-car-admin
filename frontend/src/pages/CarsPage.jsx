import { useEffect, useMemo, useState } from 'react'
import CarForm from '../components/CarForm'
import CarTable from '../components/CarTable'
import Icon from '../components/Icon'
import Modal from '../components/Modal'

const emptyForm = {
  name: '',
  price: '',
  company: '',
  year: '',
}

const numberPattern = /^\d*$/
const numberFilterNames = ['minPrice', 'maxPrice']
const numberFormNames = ['price', 'year']

function CarsPage() {
  const [cars, setCars] = useState([])
  const [detailCar, setDetailCar] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [filters, setFilters] = useState({ company: '', minPrice: '', maxPrice: '' })
  const [message, setMessage] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  const companies = useMemo(() => {
    return [...new Set(cars.map((car) => car.company))].sort()
  }, [cars])

  const totalPages = Math.max(1, Math.ceil(cars.length / pageSize))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const pagedCars = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize
    return cars.slice(startIndex, startIndex + pageSize)
  }, [cars, safeCurrentPage, pageSize])

  async function loadCars(query = filters) {
    const params = new URLSearchParams()

    if (query.company) {
      params.set('company', query.company)
    }

    if (query.minPrice) {
      params.set('minPrice', query.minPrice)
    }

    if (query.maxPrice) {
      params.set('maxPrice', query.maxPrice)
    }

    const queryString = params.toString()
    const response = await fetch(`/api/cars${queryString ? `?${queryString}` : ''}`)
    const data = await response.json()

    setCars(data)
    setCurrentPage(1)
  }

  useEffect(() => {
    let ignore = false

    fetch('/api/cars')
      .then((response) => response.json())
      .then((data) => {
        if (ignore) {
          return
        }

        setCars(data)
      })

    return () => {
      ignore = true
    }
  }, [])

  function openCreateForm() {
    setEditingId(null)
    setForm(emptyForm)
    setMessage('')
    setIsFormOpen(true)
  }

  function closeForm() {
    setEditingId(null)
    setForm(emptyForm)
    setIsFormOpen(false)
  }

  function handleFormChange(event) {
    const { name, value } = event.target

    // 가격과 연식은 숫자만 입력되도록 막습니다.
    if (numberFormNames.includes(name) && !numberPattern.test(value)) {
      return
    }

    setForm((current) => ({ ...current, [name]: value }))
  }

  function handleFilterChange(event) {
    const { name, value } = event.target

    // 검색 가격도 음수나 문자가 입력되지 않게 처리합니다.
    if (numberFilterNames.includes(name) && !numberPattern.test(value)) {
      return
    }

    setFilters((current) => ({ ...current, [name]: value }))
  }

  async function handleSearch(event) {
    event.preventDefault()
    await loadCars(filters)
  }

  async function handleResetFilters() {
    const nextFilters = { company: '', minPrice: '', maxPrice: '' }
    setFilters(nextFilters)
    await loadCars(nextFilters)
  }

  async function handleLogoClick() {
    const nextFilters = { company: '', minPrice: '', maxPrice: '' }

    setDetailCar(null)
    setDeleteTarget(null)
    setEditingId(null)
    setForm(emptyForm)
    setFilters(nextFilters)
    setMessage('')
    setIsFormOpen(false)
    setPageSize(10)
    await loadCars(nextFilters)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')

    const method = editingId ? 'PUT' : 'POST'
    const url = editingId ? `/api/cars/${editingId}` : '/api/cars'
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await response.json()

    if (!response.ok) {
      setMessage(data.message || '저장에 실패했습니다.')
      return
    }

    closeForm()
    setMessage(editingId ? '차량 정보를 수정했습니다.' : '차량을 등록했습니다.')
    await loadCars(filters)
    setDetailCar(data)
  }

  function handleEdit(car) {
    setEditingId(car._id)
    setForm({
      name: car.name,
      price: car.price,
      company: car.company,
      year: car.year,
    })
    setMessage('')
    setIsFormOpen(true)
  }

  async function confirmDelete() {
    if (!deleteTarget) {
      return
    }

    const response = await fetch(`/api/cars/${deleteTarget._id}`, { method: 'DELETE' })

    if (!response.ok) {
      setMessage('삭제에 실패했습니다.')
      return
    }

    setDeleteTarget(null)
    setDetailCar(null)
    setMessage('차량을 삭제했습니다.')
    await loadCars(filters)
  }

  async function handleSelect(id) {
    const response = await fetch(`/api/cars/${id}`)
    const data = await response.json()

    if (response.ok) {
      setDetailCar(data)
    }
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <button type="button" onClick={handleLogoClick} className="min-w-0 text-left">
            <p className="text-sm font-semibold uppercase text-blue-700">Used Car Admin</p>
            <h1 className="mt-1 text-2xl font-bold tracking-normal text-slate-950 sm:text-3xl">
              중고차 관리 서비스
            </h1>
          </button>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="grid grid-cols-2 gap-2 text-center sm:w-[240px]">
              <div className="rounded-sm border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs text-slate-500">조회</p>
                <p className="text-lg font-bold">{cars.length}</p>
              </div>
              <div className="rounded-sm border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs text-slate-500">제조사</p>
                <p className="text-lg font-bold">{companies.length}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={openCreateForm}
              className="inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-sm bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-700"
            >
              <Icon name="add" />
              차량 등록
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 sm:px-6">
        {message && (
          <p className="rounded-sm border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-blue-800">
            {message}
          </p>
        )}

        <form
          onSubmit={handleSearch}
          className="grid min-w-0 gap-3 rounded-sm border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2 xl:grid-cols-[minmax(180px,1fr)_160px_160px_auto_auto]"
        >
          <div className="grid min-w-0 gap-1">
            <label className="text-sm font-medium text-slate-700" htmlFor="companyFilter">
              제조사 검색
            </label>
            <input
              id="companyFilter"
              name="company"
              value={filters.company}
              onChange={handleFilterChange}
              list="companyOptions"
              className="h-11 w-full min-w-0 rounded-sm border border-slate-300 px-3 text-sm uppercase outline-none focus:border-slate-900"
              placeholder="HYUNDAI"
            />
            <datalist id="companyOptions">
              {companies.map((company) => (
                <option key={company} value={company} />
              ))}
            </datalist>
          </div>
          <div className="grid min-w-0 gap-1">
            <label className="text-sm font-medium text-slate-700" htmlFor="minPrice">
              최소 가격
            </label>
            <input
              id="minPrice"
              name="minPrice"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={filters.minPrice}
              onChange={handleFilterChange}
              className="h-11 w-full min-w-0 rounded-sm border border-slate-300 px-3 text-sm outline-none focus:border-slate-900"
              placeholder="2000"
            />
          </div>
          <div className="grid min-w-0 gap-1">
            <label className="text-sm font-medium text-slate-700" htmlFor="maxPrice">
              최대 가격
            </label>
            <input
              id="maxPrice"
              name="maxPrice"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              className="h-11 w-full min-w-0 rounded-sm border border-slate-300 px-3 text-sm outline-none focus:border-slate-900"
              placeholder="5000"
            />
          </div>
          <button className="inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-sm bg-blue-700 px-4 text-sm font-medium text-white hover:bg-blue-600 md:self-end">
            <Icon name="search" />
            검색
          </button>
          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-sm border border-slate-300 px-4 text-sm font-medium text-slate-700 hover:bg-slate-100 md:self-end"
          >
            <Icon name="refresh" />
            초기화
          </button>
        </form>

        <section className="grid gap-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              페이지당
              <select
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value))
                  setCurrentPage(1)
                }}
                className="h-10 rounded-sm border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-900"
              >
                <option value={10}>10개</option>
                <option value={30}>30개</option>
                <option value={50}>50개</option>
              </select>
            </label>
            <p className="text-sm text-slate-500">
              {cars.length === 0 ? '0개' : `${(safeCurrentPage - 1) * pageSize + 1}-${Math.min(safeCurrentPage * pageSize, cars.length)}개`} / 총 {cars.length}개
            </p>
          </div>

          <CarTable
            cars={pagedCars}
            onSelect={handleSelect}
            onEdit={handleEdit}
            onDelete={setDeleteTarget}
          />

          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={safeCurrentPage === 1}
              className="inline-flex h-10 items-center gap-1 whitespace-nowrap rounded-sm border border-slate-300 px-3 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Icon name="chevron_left" />
              이전
            </button>
            <span className="min-w-[72px] text-center text-sm font-semibold text-slate-700">
              {safeCurrentPage} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={safeCurrentPage === totalPages}
              className="inline-flex h-10 items-center gap-1 whitespace-nowrap rounded-sm border border-slate-300 px-3 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              다음
              <Icon name="chevron_right" />
            </button>
          </div>
        </section>
      </div>

      {isFormOpen && (
        <Modal title={editingId ? '차량 수정' : '차량 등록'} onClose={closeForm} maxWidth="max-w-2xl">
          <CarForm
            form={form}
            editingId={editingId}
            onChange={handleFormChange}
            onSubmit={handleSubmit}
            onCancel={closeForm}
          />
          {message && (
            <p className="mt-3 rounded-sm border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
              {message}
            </p>
          )}
        </Modal>
      )}

      {detailCar && (
        <Modal title="차량 상세" onClose={() => setDetailCar(null)}>
          <dl className="grid gap-3 text-sm">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <dt className="text-slate-500">ID</dt>
              <dd className="font-semibold">#{detailCar._id}</dd>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <dt className="text-slate-500">차량명</dt>
              <dd className="font-semibold">{detailCar.name}</dd>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <dt className="text-slate-500">가격</dt>
              <dd className="font-semibold">{detailCar.price.toLocaleString()}만원</dd>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <dt className="text-slate-500">제조사</dt>
              <dd className="font-semibold">{detailCar.company}</dd>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <dt className="text-slate-500">연식</dt>
              <dd className="font-semibold">{detailCar.year}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">등록일</dt>
              <dd className="font-semibold">{detailCar.created_at.slice(0, 10)}</dd>
            </div>
          </dl>
        </Modal>
      )}

      {deleteTarget && (
        <Modal title="차량 삭제" onClose={() => setDeleteTarget(null)}>
          <div className="grid gap-4">
            <p className="text-sm text-slate-700">
              정말 <span className="font-semibold text-slate-950">{deleteTarget.name}</span> 차량을 삭제하시겠습니까?
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-sm border border-slate-300 px-4 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                취소
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-sm bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-500"
              >
                <Icon name="delete" />
                삭제
              </button>
            </div>
          </div>
        </Modal>
      )}
    </main>
  )
}

export default CarsPage
