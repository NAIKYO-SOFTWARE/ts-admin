import Skeleton from 'antd/es/skeleton'
import type { ApexOptions } from 'apexcharts'
import { useEffect, useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import { useLocation } from 'react-router-dom'
import { Card, CardBody, Col } from 'reactstrap'
import { useGetBookingsQuery } from '../../../../generated/graphql'
import { cancelToken } from '../../../../helper-plugin'
import { formatDateRange, getDateRangeFromQueryString } from '../Filter'

const colorMapping: Record<string, string> = {
  Confirmed: '#2ecc71',
  Canceled: '#D61B36',
  Completed: '#1abc9c',
  Pending: '#FEB019'
}

interface ICancelReason {
  series: number[]
  labels: string[]
}

const pieChartOptions: ApexOptions = {
  chart: {
    type: 'pie'
  },
  labels: [''],
  responsive: [
    {
      breakpoint: 480,
      options: {
        legend: {
          position: 'bottom'
        }
      }
    }
  ],
  legend: {
    show: true,
    fontSize: '9px',
    position: 'right',
    horizontalAlign: 'center',
    labels: {
      colors: '#919bae',
      useSeriesColors: false
    }
  }
}

const Empty = () => (
  <Col className='empty' style={{ height: 300 }}>
    <h3>No Data</h3>
  </Col>
)

const PieChart = (props: ICancelReason) => {
  if (props.labels.length === 0) return <Empty />
  const { labels, series } = props
  pieChartOptions.labels = labels
  pieChartOptions.colors = labels.map((label, i) => (label === labels[i] ? colorMapping[label] : null))
  return <ReactApexChart options={pieChartOptions as ApexOptions} series={series} type='pie' height={360} />
}

const OrderStatus = () => {
  const token = cancelToken()
  const { search } = useLocation()
  const [cancelReason, setCancelReason] = useState<ICancelReason | null>(null)

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
      setCancelReason(null)
      const _map: Map<string | null, number> = new Map()
      data['bookings'].forEach((d) => {
        if (_map.has(d.status)) {
          const currentVal = _map.get(d.status) || 1
          _map.set(d.status, currentVal + 1)
        } else {
          _map.set(d.status, 1)
        }
      })
      const series: number[] = []
      const labels: string[] = []
      for (let [key, value] of _map.entries()) {
        labels.push(key as any)
        series.push(value)
      }
      setCancelReason({ labels, series })
    }
    return () => token.cancel()
  }, [search, data])

  return (
    <Col xl={4}>
      <Card>
        <CardBody>
          <div className='d-flex align-items-center'>
            <div className='flex-grow-1'>
              <h5 className='card-title'>Booking Status</h5>
            </div>
          </div>
          {cancelReason ? (
            <PieChart labels={cancelReason.labels} series={cancelReason.series} />
          ) : (
            <Skeleton.Button active block style={{ height: 360 }} />
          )}
        </CardBody>
      </Card>
    </Col>
  )
}

export default OrderStatus
