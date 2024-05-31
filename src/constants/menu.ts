const MENU = [
  { key: '/', label: 'Dashboard', path: '/' },
  { key: 'users', label: 'Users', path: '/users', viewable: true, creatable: false, exportable: false },
  { key: 'locations', label: 'Locations', path: '/locations', viewable: true, creatable: true, exportable: false },
  { key: 'providers', label: 'Providers', path: '/providers', viewable: true, creatable: true, exportable: false },
  { key: 'routes', label: 'Routes', path: '/routes', viewable: true, creatable: true, exportable: false },
  { key: 'bookings', label: 'Bookings', path: '/bookings', viewable: true, creatable: true, exportable: false },
  { key: 'cities', label: 'Cities', path: '/cities', viewable: true, creatable: true, exportable: false }
]

// const STATIC_PAGES_MENU = [
//   { key: 'static-pages/rules', label: 'Rules', path: '/static-pages/rules' },
//   { key: 'static-pages/introduction', label: 'Introduction', path: '/static-pages/introduction' },
//   { key: 'static-pages/about-us', label: 'About Us', path: '/static-pages/about-us' }
// { key: 'static-pages/faq', label: 'FAQ', path: '/static-pages/faq' },
// { key: 'static-pages/privacy-terms', label: 'Privacy & Terms', path: '/static-pages/privacy-terms' },
// { key: 'static-pages/refund-policy', label: 'Refund Policy', path: '/static-pages/refund-policy' },
// { key: 'static-pages/shipping-policy', label: 'Shipping Policy', path: '/static-pages/shipping-policy' },
// { key: 'static-pages/privacy-policy', label: 'Privacy Policy', path: '/static-pages/privacy-policy' },
// { key: 'static-pages/terms-of-service', label: 'Terms Of Service', path: '/static-pages/terms-of-service' },
// { key: 'static-pages/contact-information', label: 'Contact Information', path: '/static-pages/contact-information' }
// ]

// const SUPER_ADMIN_MENU = [
//   { key: 'admin/users', label: 'Admin User', path: '/admin/users', viewable: true, creatable: true, exportable: true },
//   { key: 'admin/roles', label: 'Admin Role', path: '/admin/roles', viewable: true, creatable: true, exportable: true }
// ]

// const CONFIGURATION_MENU = [
//   { key: 'static-pages/robots', label: 'Robot TXT', path: '/static-pages/robots', textarea: true },
//   { key: 'static-pages/headers', label: 'Headers', path: '/static-pages/headers', textarea: true },
//   { key: 'static-pages/ads-txt', label: 'Ads TXT', path: '/static-pages/ads-txt', textarea: true }
// ]

// const FULL_PERMISSIONS = [{ key: 'User', read: true, create: true, delete: true, update: true, collection: 'User' }]

const menu = MENU

export default menu
