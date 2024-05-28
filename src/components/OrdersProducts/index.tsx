import Table from 'rc-table'
import { ColumnsType, DefaultRecordType } from 'rc-table/lib/interface'
import { addCustomRender } from '../DataTable/util'

interface IProps {
  value: DefaultRecordType[]
  columns?: ColumnsType<DefaultRecordType>
}

const OrdersProducts = (props: IProps) => {
  const { value, columns = [] } = props

  addCustomRender(columns)

  return (
    <div className='dataTable-container'>
      <div className='dataTable'>
        <Table scroll={{ x: true }} columns={columns} data={value} />
      </div>
    </div>
  )
}

export default OrdersProducts
