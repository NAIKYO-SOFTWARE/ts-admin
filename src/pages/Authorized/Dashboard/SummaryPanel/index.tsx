import { mdiCart, mdiCash } from '@mdi/js'
import Icon from '@mdi/react'
import Skeleton from 'antd/es/skeleton'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Card, CardBody, Col, Row } from 'reactstrap'
import { useGetBookingsQuery } from '../../../../generated/graphql'
import { cancelToken, currencyFormat } from '../../../../helper-plugin'
import { formatDateRange, getDateRangeFromQueryString } from '../Filter'

interface ISummaryPanel {
  label: string
  value: number
}

const SummaryPanel = () => {
  const { search } = useLocation()
  const [summary, setSummary] = useState<ISummaryPanel[] | null>(null)

  const { startDate = '', endDate = '' } = getDateRangeFromQueryString(search)

  // Format the date range
  const { data } = useGetBookingsQuery({
    variables: {
      where: {
        created_at: formatDateRange(startDate, endDate)
      },
      limit: 1000,
      offset: 0
    }
  })

  useEffect(() => {
    if (search.includes('?date') && data) {
      setSummary(null)
      const source = cancelToken()
      const totalBookings = data.bookings_aggregate.aggregate?.count || 0
      const { totalAmount } = data.bookings.reduce(
        (acc, booking) => {
          const price = booking.itinerary.price || 0
          acc.totalAmount += price
          acc.count += 1
          return acc
        },
        { totalAmount: 0, count: 0 }
      )
      setSummary([
        { label: 'Total Bookings', value: totalBookings },
        { label: 'Total Amount', value: currencyFormat(totalAmount || 0) as any }
      ])
      return () => source.cancel()
    }
  }, [search, data])

  if (!summary) return <SummarySkeleton />

  return (
    <Row>
      {summary.map(({ label, value }, index) => (
        <Col key={index} xl={3} sm={6}>
          <Card>
            <CardBody>
              <div className='d-flex'>
                <div className='flex-shrink-0 me-3 align-self-center'>
                  <div className='avatar-sm'>{getIconByLabel(label)}</div>
                </div>
                <div className='flex-grow-1 overflow-hidden'>
                  <p className='mb-1'>{label}</p>
                  <h5 className='mb-2'>{value}</h5>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      ))}
    </Row>
  )
}

const getIconByLabel = (label: string) => {
  switch (label) {
    case 'Total Bookings':
      return <Icon className='mdi' path={mdiCart} size={2} />
    case 'Total Amount':
      return <Icon className='mdi' path={mdiCash} size={2} />
    default:
      return null
  }
}

const SummarySkeleton = () => (
  <Row>
    {[1, 2, 3, 4].map((i) => (
      <Col key={i} xl={3} sm={6}>
        <Card>
          <CardBody>
            <Skeleton.Button active block style={{ height: 50 }} />
          </CardBody>
        </Card>
      </Col>
    ))}
  </Row>
)

export default SummaryPanel
