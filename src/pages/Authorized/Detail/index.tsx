import { useLocation, useNavigate } from 'react-router-dom'
import { useAppStore } from '../../../store/app-store'

import FormBasic from '../../../components/FormBasic'

const DetailPage = (props: { uid: string }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const layouts = useAppStore((store) => store.layouts)
  const uid =
    location.pathname.split('/')[1] + (location.pathname.split('/')[3] ? '/' + location.pathname.split('/')[2] : '')
  if (!layouts || !layouts.has(uid)) return <></>

  const formLayouts = layouts.get(uid) as ILayouts
  return (
    <FormBasic
      uid={props.uid}
      layouts={{
        ...formLayouts,
        defaultValue: formLayouts.defaultValue ? JSON.parse(JSON.stringify(formLayouts.defaultValue)) : {},
        edit: JSON.parse(JSON.stringify(formLayouts.edit))
      }}
      navigate={navigate}
    />
  )
}

export default DetailPage
