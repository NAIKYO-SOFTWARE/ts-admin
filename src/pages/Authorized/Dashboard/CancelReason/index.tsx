import Skeleton from 'antd/es/skeleton'
import type { ApexOptions } from 'apexcharts'
import { useEffect, useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import { useLocation } from 'react-router-dom'
import { Card, CardBody, Col } from 'reactstrap'
import { cancelToken } from '../../../../helper-plugin'

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
    position: 'bottom',
    horizontalAlign: 'left',
    markers: {
      width: 10,
      height: 10,
      strokeWidth: 0,
      radius: 10,
      offsetX: 0,
      offsetY: 0
    },
    labels: {
      colors: '#919bae',
      useSeriesColors: false
    }
  }
}

const Empty = () => (
  <Col className='empty' style={{ height: 360 }}>
    <h3>No Data</h3>
  </Col>
)

const PieChart = (props: ICancelReason) => {
  if (props.labels.length === 0) return <Empty />
  pieChartOptions.labels = props.labels
  return <ReactApexChart options={pieChartOptions as ApexOptions} series={props.series} type='pie' height={400} />
}

const CancelReason = () => {
  const token = cancelToken()
  const { search } = useLocation()
  const [cancelReason, setCancelReason] = useState<ICancelReason | null>(null)

  useEffect(() => {
    if (search.includes('?date')) {
      setCancelReason(null)
      // fetchClient.get('/dashboard/cancel-reason' + search, { cancelToken: token.token }).then(({ data }) => {
      //   setCancelReason(data)
      // })
    }
    return () => token.cancel()
  }, [search])

  return (
    <Col xl={4} id='CancelReason'>
      <Card>
        <CardBody>
          <div className='d-flex align-items-center'>
            <div className='flex-grow-1'>
              <h5 className='card-title'>Cancel Reasons</h5>
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

export default CancelReason
