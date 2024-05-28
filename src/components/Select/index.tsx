import { Badge, Row, Typography } from 'antd'
import AntSelect, { type DefaultOptionType, type SelectProps } from 'antd/es/select'
import { useState } from 'react'
import queries, { dataHandlers } from '../../constants/queries'
import './select.scss'

interface IRelationProps {
  optionTarget: string
  type: 'relation'
  advance?: boolean
  editTarget?: string
  relation?: string
}
interface IEnumerationProps {
  enum: string[]
  type: 'enumeration'
}

const SelectWithRelation = (props: SelectProps & IRelationProps) => {
  const { optionTarget,relation, ...rest } = props
  const [options, setOptions] = useState<Array<{ value: string; label: string; tick?: boolean; tickLabel?: string }>>(
    []
  )
  
  const useGetOptions = queries[relation as any].findMany

  useGetOptions({
    onCompleted(data: any) {
      const result = dataHandlers[relation as any].select?.(data[relation as any]) || []
      setOptions(result)
    }
  })
  
  const onFilter = (inputValue: string, option?: DefaultOptionType) => {
    const label = option?.subLabel as string
    return label?.toLocaleLowerCase().includes(inputValue)
  }

  return (
    <AntSelect
      allowClear
      prefixCls='detail-select'
      size='large'
      options={(options || []).map((d) => ({
        value: d.value,
        subLabel: d.label,
        label: (
          <Badge.Ribbon text={d.tickLabel} style={{ display: d.tick ? 'block' : 'none' }} color={'cyan'}>
            <Row justify={'start'} align={'top'} style={{ gap: 2 }}>
              <Typography className='form-label' style={{ color: '#fff' }}>
                {d.label}
              </Typography>
            </Row>
          </Badge.Ribbon>
        )
      }))}
      {...rest}
      filterOption={onFilter}
    />
  )
}

const Select = (props: SelectProps & (IRelationProps | IEnumerationProps)) => {
  if (props.type === 'relation') {
    return <SelectWithRelation {...props} />
  }

  const options = props.enum ? props.enum.map((x) => ({ value: x, label: x })) : []

  return <AntSelect allowClear prefixCls='detail-select' size='large' options={options} {...props} />
}

export default Select
