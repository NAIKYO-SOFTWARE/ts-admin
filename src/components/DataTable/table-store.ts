import { produce } from 'immer'
import qs from 'qs'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

const defaultPage = 1
const defaultSize = 10

interface IPagination {
  page: number
  pageSize: number
  total?: number
}

interface ITableProps {
  loading: boolean
  dataSource?: Array<Record<string, unknown>>
  pagination: IPagination
  notification?: { type: 'success' | 'error'; description: string; message: string }
}

interface ITableState extends ITableProps {
  setLoading: (loading: boolean) => void
  onPaginationChange?: (pagination: IPagination) => void
  onRemoveRow?: (id: string) => void
  onCopyRow?: (data: any) => void
  onSetDataSource?: (data: ITableProps) => void
  onSetNotification?: (type: 'success' | 'error', description: string, message: string) => void
  onClearNotification?: () => void
}

const initialValue = () => {
  const query = qs.parse(location.search.slice(1))

  let page = parseInt(`${query.page}`)
  let pageSize = parseInt(`${query.pageSize}`)
  if (`${page}` === `${Number.NaN}`) {
    page = defaultPage
  }
  if (`${pageSize}` === `${Number.NaN}`) {
    pageSize = defaultSize
  }

  return { pagination: { page, pageSize } }
}

export const useTableStore = create(
  immer<ITableState>((set) => ({
    ...initialValue(),
    loading: true,
    onSetDataSource(data) {
      set(
        produce<ITableState>((state) => {
          state.loading = false
          state.dataSource = data.dataSource
          state.pagination = data.pagination
        })
      )
    },
    setLoading(loading) {
      set(
        produce<ITableState>((state) => {
          state.loading = loading
        })
      )
    },
    onPaginationChange(pagination) {
      set(
        produce<ITableState>((state) => {
          state.pagination = pagination
        })
      )
    },
    onRemoveRow(id) {
      set(
        produce<ITableState>((state) => {
          state.notification = { type: 'success', message: 'Success', description: 'Deleted item successful.' }
          state.dataSource = state.dataSource?.filter((x) => x.id !== id)
        })
      )
    },
    onCopyRow(data) {
      set(
        produce<ITableState>((state) => {
          state.notification = { type: 'success', message: 'Success', description: 'Coped item successful.' }
          state.dataSource = state.dataSource && [data, ...state.dataSource]
        })
      )
    },
    onSetNotification(type, message, description) {
      set(
        produce<ITableState>((state: ITableState): void => {
          state.notification = { description, message, type }
        })
      )
    },
    onClearNotification() {
      set(
        produce<ITableState>((state) => {
          state.notification = undefined
        })
      )
    }
  }))
)
