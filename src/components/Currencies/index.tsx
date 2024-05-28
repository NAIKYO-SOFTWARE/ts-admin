import type { ColumnType, ColumnsType, DefaultRecordType } from 'rc-table/lib/interface'
import { useState } from 'react'

import Input from 'antd/es/input-number'
import Space from 'antd/es/space'
import Table from 'rc-table'

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
  const [value, setValue] = useState<number | null>(props.record[props.c.dataIndex as string])

  return (
    <Space wrap>
      <Input
        rootClassName='center form-control'
        type='number'
        inputMode='numeric'
        placeholder={`Enter ${props.c.title}`}
        min={0}
        max={props.c.max}
        maxLength={props.c.max ? `${props.c.max}`.length : undefined}
        className={props.c.align}
        value={value}
        onKeyDown={() => false}
        onBlur={() => props.onChange?.(Object.assign(props.record, { [props.c.dataIndex as string]: Number(value) }))}
        onChange={(val) => setValue(Number(val))}
      />
    </Space>
  )
}

const Currencies = (props: IProps) => {
  const { value, columns = [], onChange } = props
  if (!value || value.length === 0 || !columns || columns.length === 0) {
    return <></>
  }

  const onChangeCurrencies = (record: DefaultRecordType) => {
    Object.assign(value.find((x) => x.currency === record.currency) || {}, record)
    onChange?.([...value])
  }

  columns.forEach((c: ColumnType<DefaultRecordType>) => {
    if (c.key === 'currency') return
    if (!c.render) c.render = (_, record) => <InputField c={c} record={record} onChange={onChangeCurrencies} />
  })

  return (
    <div className='dataTable-container'>
      <div className='dataTable'>
        <Table scroll={{ x: true }} columns={columns} data={value} />
      </div>
    </div>
  )
}

export default Currencies
