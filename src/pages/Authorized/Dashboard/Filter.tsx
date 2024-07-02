import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isoWeek from 'dayjs/plugin/isoWeek'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Col, Form, FormGroup, Row } from 'reactstrap'
import Button from '../../../components/Button'
import RangePicker from '../../../components/RangePicker'
import Select from '../../../components/Select'
import { updateQs } from '../../../helper-plugin'

dayjs.extend(customParseFormat)
dayjs.extend(isoWeek)

const OPTIONS = ['Last 7 Days', 'Last 30 Days', 'Today', 'Yesterday', 'Current Week', 'Current Month', 'Custom']

const DATE_FORMAT = 'YYYY-MM-DD'

const THREE_MONTHS_IN_DAYS = 31 * 3

const TIME_RANGES: Record<string, [string, string]> = {
  'Last 7 Days': [dayjs().subtract(6, 'day').format(DATE_FORMAT), dayjs().format(DATE_FORMAT)],
  'Last 30 Days': [dayjs().subtract(29, 'day').format(DATE_FORMAT), dayjs().format(DATE_FORMAT)],
  Today: [dayjs().format(DATE_FORMAT), dayjs().format(DATE_FORMAT)],
  Yesterday: [dayjs().subtract(1, 'day').format(DATE_FORMAT), dayjs().subtract(1, 'day').format(DATE_FORMAT)],
  'Current Week': [dayjs().isoWeekday(1).startOf('isoWeek').format(DATE_FORMAT), dayjs().format(DATE_FORMAT)],
  'Current Month': [dayjs().startOf('month').format(DATE_FORMAT), dayjs().format(DATE_FORMAT)],
  Custom: ['', '']
}

const checkRangeValid = (dates: [string, string]) => {
  return dates && dates.every((d) => dayjs(d).isValid())
}

export function formatDateRange(startDate: string | null, endDate: string | null) {
  const startDateTime = `${startDate}T00:00:00`
  const endDateTime = `${endDate}T23:59:59`
  return { _gte: startDateTime, _lte: endDateTime }
}

export function generateDateLabels(startDate: string | null, endDate: string | null) {
  const labels = []
  const currentDate = new Date(startDate || new Date())
  const finalDate = new Date(endDate || new Date())

  while (currentDate <= finalDate) {
    labels.push(currentDate.toISOString().split('T')[0])
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return labels
}

export function getDateRangeFromQueryString(querystring: string) {
  const params = new URLSearchParams(querystring)
  const startDate = params.get('date[0]')
  const endDate = params.get('date[1]')
  return { startDate, endDate }
}

const initialValue = () => {
  const option = JSON.parse(sessionStorage.getItem('option') as string)

  if (option && checkRangeValid(option.dates)) return option
  return { selected: OPTIONS[0], dates: TIME_RANGES[OPTIONS[0]] }
}

const Filter = () => {
  const navigate = useNavigate()
  const [state, setState] = useState(initialValue())

  useEffect(() => {
    if (location.href.search('[?&]date') === -1) {
      navigate(`${location.pathname}?` + updateQs({ date: state.dates }))
    }
  }, [])

  const handleDateChange = (selected: string) => setState({ selected, dates: TIME_RANGES[selected] })
  const handleRangeChange = (values: [string, string]) => {
    const from = dayjs(values[0])
    const to = dayjs(values[1])
    if (from.isBefore(to) && to.diff(from, 'days') < THREE_MONTHS_IN_DAYS) {
      setState({ dates: values, selected: OPTIONS[OPTIONS.length - 1] })
    }
  }

  const onRefresh = () => {
    const option = { selected: state.selected, dates: state.dates }
    sessionStorage.setItem('option', JSON.stringify(option))
    navigate(`${location.pathname}?` + updateQs({ date: state.dates }))
  }

  const isDisabled = state.selected === OPTIONS[OPTIONS.length - 1] && state.dates.some((x: string) => !x)
  return (
    <Form className='filter filter-form' noValidate>
      <FormGroup className='form-group'>
        <Row id='date-range'>
          <Col md={3}>
            <Select
              type='enumeration'
              defaultActiveFirstOption
              value={state.selected}
              enum={OPTIONS}
              placeholder='Select date'
              onChange={handleDateChange}
              allowClear={false}
            />
          </Col>
          <Col md={4}>
            <RangePicker onChange={handleRangeChange} values={state.dates} />
          </Col>
        </Row>
        <div style={{ display: 'flex', justifyContent: 'end' }} className='mt-3'>
          <Button type='button' onClick={onRefresh} disabled={isDisabled}>
            Refresh
          </Button>
        </div>
      </FormGroup>
    </Form>
  )
}

export default Filter
