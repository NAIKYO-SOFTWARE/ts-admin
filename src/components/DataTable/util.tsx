import Avatar from 'antd/es/avatar'
import Skeleton from 'antd/es/skeleton'
import Tooltip from 'antd/es/tooltip'
import dayjs from 'dayjs'
import Image from '../Image'

import { Link } from 'react-router-dom'

import type { ColumnType, ColumnsType } from 'rc-table/lib/interface'

interface IColProps extends ColumnType<any> {
  note?: string
  filter?: { value: unknown; text: string }[]
  searchable?: boolean
}

const renderBoolean = (value: any) => {
  return value ? (
    <span className='badge bg-primary me-1'>Active</span>
  ) : (
    <span className='badge bg-light me-1'>Inactive</span>
  )
}

const renderDate = (value: any) => {
  return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
}

const renderImage = (_: unknown, col: Record<string, string>) => {
  if (!col.img) return <Avatar src={'/noavatar.png'} key={'no_image_' + col.id} />
  return <Image src={col.img} key={'image_' + col.id} alt='' size={100} />
}

const renderColor = (value: string) => {
  return value ? <div style={{ height: 24, backgroundColor: value, borderRadius: 50 }}></div> : '-'
}

const renderLink = (value: unknown) => {
  if (value) {
    const { id, label, path } = value as { id: number; label: string; path: string }
    return (
      <Link to={path + '/' + id}>
        <span>{label}</span>
      </Link>
    )
  }
  return '-'
}

const renderPreview = (value: string) => {
  if (value) {
    return (
      <a href={value} target='blank'>
        <span>{value}</span>
      </a>
    )
  }
  return '-'
}

const renderSkeleton = () => {
  return <Skeleton.Input active block />
}

const renderValue = (value: any) => {
  if (!value) {
    return '-'
  }

  return <Tooltip title={value}>{`${value}`.length > 50 ? `${value}`.substring(0, 50) + '...' : value}</Tooltip>
}

export const addCustomRender = (columns: ColumnsType<any>, loading = false) => {
  columns.forEach((x: IColProps) => {
    if (x.render) return
    if (loading) {
      x.render = renderSkeleton
      return
    }

    if (x.note === 'render-bool') {
      x.render = renderBoolean
    } else if (x.note === 'render-date') {
      x.render = renderDate
    } else if (x.note === 'render-img') {
      x.render = renderImage
    } else if (x.note === 'render-color') {
      x.render = renderColor
    } else if (x.note === 'render-link') {
      x.render = renderLink
    } else if (x.note === 'render-preview') {
      x.render = renderPreview
    } else {
      x.render = renderValue
    }
  })
}
