import { parse, stringify } from 'qs'

export const updateQs = (latest: object) => {
  const query = parse(location.search.slice(1))
  return stringify({ ...query, ...latest }, { encodeValuesOnly: true })
}

export const parseQs = () => {
  return parse(location.search.slice(1))
}

export const currencyFormat = (number: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(number)
}
