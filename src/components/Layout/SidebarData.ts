import { mdiAccountGroup, mdiHome, mdiSitemapOutline } from '@mdi/js'

const SidebarData = [
  { label: 'Menu', children: [{ icon: mdiHome, key: '/' }] },
  {
    label: 'Collections',
    isMainMenu: true,
    children: [
      { icon: mdiAccountGroup, key: 'users' },
      { icon: mdiSitemapOutline, key: 'locations' }
      // { icon: mdiCupcake, key: 'rooms' },
      // { icon: mdiQuadcopter, key: 'ticket-agents' },
      // { icon: mdiHelpBoxMultiple, key: 'customer-supports' },
      // { icon: mdiStar, key: 'balance-transactions' },
      // { icon: mdiCartVariant, key: 'transactions' },
      // { icon: mdiInboxArrowDown, key: 'investments' },
      // { icon: mdiInboxMultiple, key: 'ticket-vips' }
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
