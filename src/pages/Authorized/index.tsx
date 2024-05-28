import { FC, Suspense, lazy, memo, useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from '../../components/Layout'
import menu from '../../constants/menu'
import locationSchema from '../../schemas/location.json'
import userSchema from '../../schemas/user.json'

import { useAppStore } from '../../store/app-store'
import '../../styles/global.scss'

const Profile = lazy(() => import('./Profile'))
const DashboardPage = lazy(() => import('./Dashboard'))
const DetailPage = lazy(() => import('./Detail'))
const StaticPage = lazy(() => import('./Static'))
const Forbidden = lazy(() => import('../../components/Forbidden'))
const DataTable = lazy(() => import('../../components/DataTable'))

interface IState {
  isLoading: boolean
  routes: any[]
}

const InternalFallback = () => {
  return (
    <div className='InternalFallback'>
      <div className='lds'>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  )
}

const Authorized: FC = memo(
  () => {
    const [state, setState] = useState<IState>({ isLoading: true, routes: [] })
    const setSchemas = useAppStore((s) => s.setSchemas)

    useEffect(() => {
      const routeItems: any[] = []
      menu?.forEach((m: any) => {
        if (m.key.startsWith('static-pages')) {
          routeItems.push(<Route key={m.path} path={m.path} element={<StaticPage {...m} />} />)
        } else {
          routeItems.push(<Route key={m.path} path={m.path} element={<DataTable uid={m.key} {...m} />} />)
          if (m.viewable !== false) {
            routeItems.push(<Route key={m.path + '/:id'} path={m.path + '/:id'} element={<DetailPage uid={m.key} />} />)
          }
        }
      })
      setState({ isLoading: false, routes: routeItems })
      setSchemas?.([userSchema as any, locationSchema as any])
    }, [])

    if (state.isLoading) {
      return <></>
    }

    return (
      <Layout>
        <Suspense fallback={<InternalFallback />}>
          <Routes>
            <Route path='/' element={<DashboardPage />} />
            <Route path='/me' element={<Profile />} />
            {state.routes}
            <Route path='*' element={<Forbidden />} />
          </Routes>
        </Suspense>
      </Layout>
    )
  },
  () => true
)

export default Authorized
