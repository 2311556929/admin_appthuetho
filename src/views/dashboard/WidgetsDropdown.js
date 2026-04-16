import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import {
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetStatsA,
  CBadge,
} from '@coreui/react'
import { getStyle } from '@coreui/utils'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import { cilArrowBottom, cilArrowTop, cilOptions } from '@coreui/icons'
import { callApi, callApiWithToken } from '../../services/api.js'

const WidgetsDropdown = (props) => {
  const widgetChartRef1 = useRef(null)
  const widgetChartRef2 = useRef(null)

  useEffect(() => {
    document.documentElement.addEventListener('ColorSchemeChange', () => {
      if (widgetChartRef1.current) {
        setTimeout(() => {
          widgetChartRef1.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-primary')
          widgetChartRef1.current.update()
        })
      }

      if (widgetChartRef2.current) {
        setTimeout(() => {
          widgetChartRef2.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-info')
          widgetChartRef2.current.update()
        })
      }
    })
  }, [widgetChartRef1, widgetChartRef2])

  ////////////////////////
  const api_all_products = import.meta.env.VITE_API_SHOW_PRODUCTS
  const api_all_users = import.meta.env.VITE_API_SHOW_USERS
  const api_all_questions = import.meta.env.VITE_API_SHOW_QUESTION
  const api_all_orders = import.meta.env.VITE_API_SHOW_ORDERS

  const auth = JSON.parse(localStorage.getItem('auth'))

  // lấy ra tổng
  const [count, setCount] = useState({})
  useEffect(() => {
    const fetchApiProduct = async () => {
      // count Product
      const resultProduct = await callApi(api_all_products)
      const countProduct = resultProduct.products.length

      //count User
      const resultUser = await callApi(api_all_users)
      const countUser = resultUser.users.length

      //count Question
      const resultQuestion = await callApi(api_all_questions)
      const countQuestion = resultQuestion.filter(
        (question) => question.answer === '' || question.answer === null,
      ).length

      //count Order
      const resultOrder = await callApiWithToken(api_all_orders, auth.token)
      const countOrder = resultOrder.orders.length

      setCount({ countProduct, countOrder, countUser, countQuestion })
    }
    fetchApiProduct()
  }, [])
  console.log(count)

  return (
    <CRow className="g-3">
      <CCol sm={6} xl={4} xxl={3}>
        <CBadge
          color="primary"
          className="d-flex justify-content-center gap-5 align-items-center fs-4 w-100"
          style={{ height: '100px' }}
        >
          <span>Tổng số đơn</span>
          <span>1</span>
        </CBadge>
      </CCol>

      <CCol sm={6} xl={4} xxl={3}>
        <CBadge
          color="danger"
          className="d-flex justify-content-center gap-5 align-items-center fs-4 w-100"
          style={{ height: '100px' }}
        >
          <span>Chưa xử lý</span>
          <span>1</span>
        </CBadge>
      </CCol>

      <CCol sm={6} xl={4} xxl={3}>
        <CBadge
          color="warning"
          className="d-flex justify-content-center gap-5 align-items-center fs-4 w-100"
          style={{ height: '100px' }}
        >
          <span>Đang chờ thợ</span>
          <span>0</span>
        </CBadge>
      </CCol>

      <CCol sm={6} xl={4} xxl={3}>
        <CBadge
          color="success"
          className="d-flex justify-content-center gap-5 align-items-center fs-4 w-100"
          style={{ height: '100px' }}
        >
          <span>Đã hoàn thành</span>
          <span>0</span>
        </CBadge>
      </CCol>
    </CRow>
  )
}

WidgetsDropdown.propTypes = {
  className: PropTypes.string,
  withCharts: PropTypes.bool,
}

export default WidgetsDropdown
