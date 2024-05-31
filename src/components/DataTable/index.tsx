import { MouseEvent, ReactNode, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAppStore } from '../../store/app-store'
import { useTableStore } from './table-store'

import Notification from 'antd/es/notification'
import Button from '../Button'
import Filter from './Filter'

import queries, { dataHandlers, queryStrings } from '../../constants/queries'
import DataRow from './DataRow'
import './dataTable.scss'

type Props = { title: ReactNode; uid: string; ssr?: boolean }

const ExportControl = (props: { onExport: () => Promise<void> }) => {
  const [isExporting, setIsExporting] = useState(false)

  const onExportHandler = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setIsExporting(true)
    props.onExport().finally(() => setIsExporting(false))
  }

  return (
    <Button disabled={isExporting} color='info' onClick={onExportHandler}>
      Export
    </Button>
  )
}

const NotificationHolder = () => {
  const [api, contextHolder] = Notification.useNotification()
  const notification = useTableStore((store) => store.notification)
  const onClearNotification = useTableStore((store) => store.onClearNotification)

  useEffect(() => {
    if (notification) {
      api[notification?.type || 'success']({ message: notification?.message, description: notification?.description })
      setTimeout(() => {
        onClearNotification?.()
      }, 2000)
    }
  }, [notification?.message])

  return <>{contextHolder}</>
}

const parseQueryString = (queryString: string) => {
  const params = new URLSearchParams(queryString)
  const queryObject: any = {}
  for (const [key, value] of params.entries()) {
    queryObject[key] = value
  }
  return queryObject
}

const generateWhereClause = (uid: string, queryParams: any, filterable: any) => {
  const where: any = { ...queryStrings[uid] }
  filterable.flat().forEach((filter: any) => {
    const { name, type } = filter
    if (queryParams[name]) {
      switch (type) {
        case 'string':
          where[name] = { _ilike: `%${queryParams[name]}%` }
          break
        case 'date':
          where[name] = { _eq: new Date(queryParams[name]).toISOString() }
          break
        default:
          where[name] = { _eq: queryParams[name] }
      }
    }
  })
  return where
}

const DataTable = (props: Props) => {
  const layouts = useAppStore((store) => (store.layouts?.has(props.uid) ? store.layouts?.get(props.uid) : null))
  const location = useLocation()
  const { setLoading, onSetDataSource, onRemoveRow, onSetNotification } = useTableStore()

  const [variables, setVariables] = useState({
    where: {},
    limit: 10,
    offset: 0
  })

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0
  })

  const useFindMany = queries[props.uid]?.findMany
  const useDeleteOne = queries[props.uid]?.deleteOne

  const [onRemove] = useDeleteOne()
  const { data, loading, error } = useFindMany({
    variables
  })

  useEffect(() => {
    if (data) {
      const total = data[layouts?.aggregateField as any].aggregate.count
      const dataHandler = dataHandlers[props.uid].many
      onSetDataSource?.({
        loading,
        pagination: {
          ...pagination,
          total
        },
        dataSource: dataHandler?.(data[props.uid])
      })
      setPagination((prev) => ({
        ...prev,
        total
      }))
    } else {
      setLoading(true)
    }

    if (error) {
      onSetNotification?.('error', 'Error', error.message || 'An error occurred. Please try again later')
    }
  }, [data, loading, error])

  useEffect(() => {
    const queryParams = parseQueryString(location.search) as any
    const where = generateWhereClause(props.uid, queryParams, layouts?.filterable)

    setVariables({
      where,
      limit: queryParams.pageSize ? parseInt(queryParams.pageSize) : 10,
      offset: queryParams.page
        ? (parseInt(queryParams.page) - 1) * (queryParams.pageSize ? parseInt(queryParams.pageSize) : 10)
        : 0
    })
    setPagination((prev) => ({
      ...prev,
      page: queryParams.page ? parseInt(queryParams.page) : 1,
      pageSize: queryParams.pageSize ? parseInt(queryParams.pageSize) : 10
    }))
  }, [location.search])

  const handleDelete = (id: string) => {
    if (!id) return
    return onRemove({
      variables: {
        id: Number(id)
      }
    })
      .then(() => {
        onRemoveRow?.(id)
        return id
      })
      .catch((e: any) => {
        onSetNotification?.(
          'error',
          'Error',
          e?.response?.data?.message || 'Error! An error occurred. Please try again later'
        )
        return
      })
  }

  const handleExport = async () => {
    try {
    } catch {
      onSetNotification?.('error', 'Error', 'Error! An error occurred. Please try again later')
    }
  }

  return (
    <div className='dataTable-container'>
      <NotificationHolder />
      <div className='info'>
        <h1>{props.title}</h1>
        {layouts?.exportable && <ExportControl onExport={handleExport} />}
        {layouts?.creatable && (
          <Link to={`/${props.uid}/new`}>
            <Button color='success'>Add New</Button>
          </Link>
        )}
      </div>
      {layouts?.filterable && <Filter filterable={layouts?.filterable} />}
      <div className='dataTable'>
        <DataRow
          columns={layouts?.list as any}
          uid={props.uid}
          onDelete={handleDelete}
          deletable={!!layouts?.deletable}
          editable={!!layouts?.editable}
        />
      </div>
    </div>
  )
}

export default DataTable
