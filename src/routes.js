import { element } from 'prop-types'
import React from 'react'


//duytan
const Product = React.lazy(() => import('./views/product/Product.js'))
const FormAddCategory = React.lazy(() => import('./views/product/FormAddCaterory.js'))
const User_khach = React.lazy(() => import('./views/users/Users_khach.js'))
const User_tho = React.lazy(() => import('./views/users/Users_tho.js'))
const FormAddUser = React.lazy(() => import('./views/users/FormAddUser.js'))
const FormAddRole = React.lazy(() => import('./views/users/FormAddRole.js'))
const FormAddBanner = React.lazy(() => import('./views/banners/FormAddBanner.js'))
const Dashboard = React.lazy(() => import('./views/pages/admin/Dashboard'))
const Orders = React.lazy(() => import('./views/pages/admin/Orders'))
const Users = React.lazy(() => import('./views/pages/admin/Users'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/orders', name: 'Đơn hàng', element: Orders },
  { path: '/users', name: 'Người dùng', element: Users },
  { path: '/allorders', name: 'All orders', element: Orders }, // Không phải /allproducts
  //duytan
  { path: '/allproducts', name: 'All products', element: Product },
  { path: '/addcategories', name: 'Add categories', element: FormAddCategory },
  { path: '/allusers_khach', name: 'Add specs', element: User_khach },
  { path: '/allusers_tho', name: 'Add specs', element: User_tho },
  { path: '/adduser', name: 'Add specs', element: FormAddUser },
  { path: '/addrole', name: 'Add specs', element: FormAddRole },
  { path: '/allorders', name: 'All orders', element: Orders },
  { path: '/addbanner', name: 'Add banners', element: FormAddBanner },
]

export default routes
