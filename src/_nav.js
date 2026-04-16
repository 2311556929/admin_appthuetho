import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilApplications,
  cilPlaylistAdd,
  cilUserPlus,
  cilUser,
} from '@coreui/icons'
import { CNavItem, CNavTitle } from '@coreui/react'

const getNav = () => {
  const auth = JSON.parse(localStorage.getItem('auth'))
  const permissions = auth?.user?.permissions || auth?.user?.role || ''

  const nav = [
    {
      component: CNavItem,
      name: 'Dashboard',
      to: '/dashboard',
      icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    },
    {
      component: CNavTitle,
      name: 'Quản lý dịch vụ',
    },
    {
      component: CNavItem,
      name: 'Tất cả đơn',
      to: '/allorders', // Đảm bảo trùng với routes.js
      icon: <CIcon icon={cilApplications} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Thêm dịch vụ',
      to: '/addcategories',
      icon: <CIcon icon={cilPlaylistAdd} customClassName="nav-icon" />,
    },
    {
      component: CNavTitle,
      name: 'Quản lý người dùng',
    },
    {
      component: CNavItem,
      name: 'Khách hàng',
      to: '/allusers_khach',
      icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: 'Thợ',
      to: '/allusers_tho',
      icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    },
  ]

  // Chỉ admin mới thấy các mục này
  if (permissions === 'admin') {
    nav.push(
      {
        component: CNavItem,
        name: 'Đăng kí thợ',
        to: '/adduser',
        icon: <CIcon icon={cilUserPlus} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Phân quyền',
        to: '/addrole',
        icon: <CIcon icon={cilUserPlus} customClassName="nav-icon" />,
      }
    )
  }

  return nav
}

export default getNav()