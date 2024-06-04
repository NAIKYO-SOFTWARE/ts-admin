import {
  mdiAccountGroup,
  mdiCartVariant,
  mdiCupcake,
  mdiHelpBoxMultiple,
  mdiHome,
  mdiInboxMultiple,
  mdiQuadcopter,
  mdiSitemapOutline
} from '@mdi/js'

const SidebarData = [
  { label: 'Menu', children: [{ icon: mdiHome, key: '/' }] },
  {
    label: 'Collections',
    isMainMenu: true,
    children: [
      { icon: mdiAccountGroup, key: 'users' },
      { icon: mdiHelpBoxMultiple, key: 'bookings' },
      { icon: mdiInboxMultiple, key: 'cities' },
      { icon: mdiSitemapOutline, key: 'locations' },
      { icon: mdiCupcake, key: 'routes' },
      { icon: mdiQuadcopter, key: 'providers' },
      { icon: mdiCartVariant, key: 'itinerary' }
      // { icon: mdiStar, key: 'balance-transactions' },
      // { icon: mdiCartVariant, key: 'transactions' },
      // { icon: mdiInboxArrowDown, key: 'investments' },
    ]
  }
  // {
  //   label: 'Static Pages',
  //   isMainMenu: true,
  //   children: [
  //     { icon: mdiInformation, key: 'static-pages/rules' },
  //     { icon: mdiFitToPage, key: 'static-pages/introduction' },
  //     { icon: mdiChartArc, key: 'static-pages/about-us' }
  //   ]
  // },
  // {
  //   label: 'Configuration',
  //   children: [
  //     { icon: mdiRobot, key: 'static-pages/robots' },
  //     { icon: mdiFormatHeaderEqual, key: 'static-pages/headers' },
  //     { icon: mdiGoogleAds, key: 'static-pages/ads-txt' }
  //   ]
  // },
  // {
  //   label: 'Maintenance',
  //   children: [
  //     { icon: mdiAccountCheck, key: 'admin/users', role: 'super-admin' },
  //     { icon: mdiAccountKeyOutline, key: 'admin/roles', role: 'super-admin' }
  //   ]
  // }
]
export default SidebarData
