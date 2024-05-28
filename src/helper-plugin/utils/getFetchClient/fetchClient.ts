import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import auth from '../auth'

export type RequestConfig = AxiosRequestConfig

export const cancelToken = () => axios.CancelToken.source()

const reqErrorInterceptor = (error: any) => {
  axios.get('')
  return Promise.reject(error)
}

const resInterceptor = (response: any) => response

const resErrorInterceptor = (error: { response: { status: number; request: XMLHttpRequest } }) => {
  // whatever you want to do with the error
  if (error?.response?.status === 401 && !/sign-in/.test(error.response.request.responseURL)) {
    auth.clearToken()
    window.location.href = '/auth/login?redirectUrl=' + location.pathname
  }
  throw error
}

const addInterceptors = (instance: AxiosInstance) => {
  instance.interceptors.request.use((v) => {
    if (v.method === 'get') {
      v.url += `${v.url?.includes('?') ? '&' : '?'}tz=` + new Date().getTimezoneOffset()
    }

    v.headers.setAuthorization(`Bearer ${auth.getToken()}`)
    return v
  }, reqErrorInterceptor)

  instance.interceptors.response.use(resInterceptor, resErrorInterceptor)
}

export const fetchClient = () => {
  const instance = axios.create({
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' }
  })
  addInterceptors(instance)

  return instance
}

export default fetchClient()
