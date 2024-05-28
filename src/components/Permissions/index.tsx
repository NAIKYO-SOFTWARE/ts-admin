import { ColumnType, ColumnsType, DefaultRecordType } from 'rc-table/lib/interface'
import { useRef } from 'react'

import Table from 'rc-table'
import Checkbox from '../Checkbox'

interface IProps {
  value: DefaultRecordType[]
  columns?: ColumnsType<DefaultRecordType>
  onChange?: (value: DefaultRecordType[]) => void
}

const InputField = (props: {
  onChange?: (record: DefaultRecordType) => void
  record: DefaultRecordType
  c: ColumnType<DefaultRecordType> & { max?: number }
}) => {
  const value = useRef(props.record)

  return (
    <Checkbox
      className={props.c.align}
      defaultChecked={value.current[props.c.dataIndex as string]}
      onChange={(event) => {
        Object.assign(value.current, { [props.c.dataIndex as string]: event.target.checked })
        props.onChange?.(value.current)
      }}
    />
  )
}

const Permissions = (props: IProps) => {
  const { value, columns = [], onChange } = props

  const onChangePermissions = (record: DefaultRecordType) => {
    Object.assign(value.find((x) => x.key === record.key) || {})
    onChange?.([...value])
  }

  columns.forEach((c: ColumnType<DefaultRecordType>) => {
    if (c.key === 'collection') return
    if (!c.render)
      c.render = (_, record: DefaultRecordType) => <InputField c={c} record={record} onChange={onChangePermissions} />
  })

  return (
    <div className='dataTable-container'>
      <div className='dataTable'>
        <Table scroll={{ x: true }} columns={columns} data={value} />
      </div>
    </div>
  )
}

export default Permissions
