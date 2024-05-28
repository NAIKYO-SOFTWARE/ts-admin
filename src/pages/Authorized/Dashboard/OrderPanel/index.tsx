import Skeleton from 'antd/es/skeleton'
import type { ApexOptions } from 'apexcharts'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import { useLocation } from 'react-router-dom'
import { Card, CardBody, Col } from 'reactstrap'
import { cancelToken } from '../../../../helper-plugin'

const lineChartColor = 'rgb(251, 77, 83)'
const barChartColor = '#0ab39c'
const revenueChartColor = '#f57947'

interface IOrderPanels {
  labels: Array<string>
  series: Array<{
    name: string
    type: string
    data: Array<number>
  }>
}

const LineColumnAreaOption: ApexOptions = {
  chart: {
    stacked: false,
    toolbar: {
      show: false
    }
  },
  stroke: {
    curve: 'smooth',
    dashArray: [0, 8, 0]
  },
  plotOptions: {
    bar: {
      columnWidth: '50%'
    }
  },
  colors: [barChartColor, lineChartColor, revenueChartColor],
  fill: {
    opacity: [0.85, 0.25, 1],
    gradient: {
      inverseColors: false,
      shade: 'light',
      type: 'vertical',
      opacityFrom: 0.85,
      opacityTo: 0.55,
      stops: [0, 100, 100, 100]
    }
  },
  labels: [''],
  markers: {
    size: 0
  },
  legend: {
    labels: {
      colors: '#919bae',
      useSeriesColors: false
    },
    show: true,
    fontSize: '11px',
    position: 'bottom',
    horizontalAlign: 'center'
  },
  xaxis: {
    tickAmount: 10,
    labels: {
      style: {
        colors: '#919bae'
      },
      formatter: (value) => dayjs(value).format(window.innerWidth >= 770 ? 'YYYY-MM-DD' : 'MM-DD')
    }
  },
  tooltip: {
    shared: true,
    intersect: false
  },
  grid: {
    borderColor: '#919bae2b'
  }
}

const currencyFormat = (number: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0
  }).format(number)
}

const Empty = () => (
  <Col className='empty' style={{ height: 360 }}>
    <h3>No Data</h3>
  </Col>
)

const LineColumnArea = (props: IOrderPanels) => {
  const { labels, series } = props

  if (labels.length === 0) return <Empty />

  const yAxisConfig = series.map((s, idx) => ({
    ...s,
    opposite: idx === 0,
    min: 0,
    seriesName: idx === 0 ? 'Total Orders' : 'Total Amount',
    forceNiceScale: true,
    showAlways: true,
    labels: {
      show: idx !== 2,
      style: { colors: [barChartColor, lineChartColor, revenueChartColor][idx] },
      formatter: (val: number) => (Number.isInteger(val) ? (idx === 0 ? val : currencyFormat(val)) : '')
    }
  }))

  LineColumnAreaOption.labels = labels
  LineColumnAreaOption.yaxis = yAxisConfig as ApexYAxis
  LineColumnAreaOption.stroke = {
    ...LineColumnAreaOption.stroke,
    width: labels?.length === 1 ? [0, 5, 0] : [0, 0.5, 0]
  }

  return (
    <ReactApexChart
      options={LineColumnAreaOption}
      series={series}
      type='line'
      height='350'
      stacked='false'
      className='apex-charts'
    />
  )
}

const OrderPanel = () => {
  const token = cancelToken()
  const { search } = useLocation()
  const [orderPanels, setOrderPanels] = useState<IOrderPanels | null>(null)

  useEffect(() => {
    if (search.includes('?date')) {
      setOrderPanels(null)
      // fetchClient.get('/dashboard/order-analytics' + search, { cancelToken: token.token }).then(({ data }) => {
      //   const isEmpty = data.series.every(({ data }: { data: number[] }) => data.every((d) => d == 0))
      //   setOrderPanels(!isEmpty ? data : { labels: [], series: [] })
      // })
    }
    return () => token.cancel()
  }, [search])

  return (
    <Col xl={8}>
      <Card>
        <CardBody>
          <div className='d-flex align-items-center'>
            <div className='flex-grow-1'>
              <h5 className='card-title'>Order Analytics</h5>
            </div>
          </div>
          {orderPanels ? (
            <LineColumnArea labels={orderPanels.labels} series={orderPanels.series} />
          ) : (
            <Skeleton.Button active block style={{ height: '360px' }} />
          )}
        </CardBody>
      </Card>
    </Col>
  )
}

export default OrderPanel
