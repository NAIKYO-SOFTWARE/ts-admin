import Skeleton from 'antd/es/skeleton'
import type { ApexOptions } from 'apexcharts'
import { useEffect, useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import { useLocation } from 'react-router-dom'
import { Card, CardBody, Col } from 'reactstrap'
import { cancelToken } from '../../../../helper-plugin'

interface IDeliveryStats {
  series: number[]
  labels: string[]
}

const colorMapping: Record<string, string> = {
  VOID: '#c668ff',
  Unknown: '#3d6678',
  DELIVERED: '#2ecc71',
  FOR_PICK_UP: '#1abc9c',
  RTS: '#D61B36',
  IN_TRANSIT: '#48bbe8',
  IN_TRANSIT_HOLD: '#FEB019',
  RETURNED: '#ffa578'
}

const pieChartOptions: ApexOptions = {
  chart: {
    type: 'donut'
  },
  labels: [],
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

const PieChart = ({ labels, series }: IDeliveryStats) => {
  if (labels.length === 0) return <Empty />
  pieChartOptions.labels = labels
  pieChartOptions.colors = labels.map((label, i) => (label === labels[i] ? colorMapping[label] : null))
  return (
    <ReactApexChart
      className='delivery-chart'
      options={pieChartOptions as ApexOptions}
      series={series}
      type='donut'
      height={360}
    />
  )
}

const DeliveryStats = () => {
  const token = cancelToken()
  const { search } = useLocation()
  // const fetchClient = getFetchClient()
  const [deliveryStats, setDeliveryStats] = useState<IDeliveryStats | null>(null)

  useEffect(() => {
    if (search.includes('?date')) {
      setDeliveryStats(null)
      // fetchClient.get('/dashboard/delivery-stats' + search, { cancelToken: token.token }).then(({ data }) => {
      //   setDeliveryStats(data)
      // })
    }
    return () => token.cancel()
  }, [search])

  return (
    <Col xl={6}>
      <Card>
        <CardBody>
          <div className='d-flex align-items-center'>
            <div className='flex-grow-1'>
              <h5 className='card-title'>Delivery Status</h5>
            </div>
          </div>
          {deliveryStats ? (
            <PieChart labels={deliveryStats.labels} series={deliveryStats.series} />
          ) : (
            <Skeleton.Button active block style={{ height: 360 }} />
          )}
        </CardBody>
      </Card>
    </Col>
  )
}

export default DeliveryStats
