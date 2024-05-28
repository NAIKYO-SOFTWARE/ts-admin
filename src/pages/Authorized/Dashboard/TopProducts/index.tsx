import Skeleton from 'antd/es/skeleton'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Card, CardBody, Col } from 'reactstrap'
import Image from '../../../../components/Image'
import { cancelToken } from '../../../../helper-plugin'

interface ITopProducts {
  name: string
  slug: string
  id: string
  images: string | null
  totalOrders: number
}

const Empty = () => (
  <Col className='empty' style={{ height: 300 }}>
    <h3>No Data</h3>
  </Col>
)

const Products = ({ topProducts }: { topProducts: ITopProducts[] | null }) => {
  if (!topProducts?.length) return <Empty />
  return topProducts.map((item, key) => (
    <Link key={key} to={`/products/${item.id}`} className='text-body d-block'>
      <div className='d-flex py-3'>
        <div className='flex-shrink-0 me-3 align-self-center'>
          <Image src={item.images?.split(',')[0] ?? ''} alt={item.name} className='rounded-circle avatar-sm' />
        </div>
        <div className='flex-grow-1 overflow-hidden d-sm-flex flex-sm-column justify-content-sm-between'>
          <h5 className='font-size-14 mb-1'>{item.name}</h5>
          <p className='text-truncate m-sm-0 '>Total orders: {item.totalOrders}</p>
        </div>
      </div>
    </Link>
  ))
}

const TopProducts = () => {
  const token = cancelToken()
  const [topProducts, setTopProducts] = useState<ITopProducts[] | null>(null)
  const { search } = useLocation()

  useEffect(() => {
    if (search.includes('?date')) {
      // fetchClient
      //   .get('/dashboard/top-products' + search, { cancelToken: token.token })
      //   .then(({ data }) => setTopProducts(data))
    }
    return () => token.cancel()
  }, [search])

  return (
    <Col lg={12}>
      <Card>
        <CardBody>
          <div className='flex-grow-1'>
            <h5 className='card-title'>Top Products</h5>
          </div>
          <div className='pe-3'>
            {topProducts ? (
              <Products topProducts={topProducts} />
            ) : (
              <Skeleton.Button active block style={{ height: 300 }} />
            )}
          </div>
        </CardBody>
      </Card>
    </Col>
  )
}
export default TopProducts
