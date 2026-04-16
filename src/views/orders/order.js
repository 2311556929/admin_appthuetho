import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  CCol,
  CFormInput,
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CTableBody,
  CButton,
} from '@coreui/react'
import { callApiWithToken } from '../../services/api'

const api_show_orders = import.meta.env.VITE_API_SHOW_ORDERS
const api_update_orders = import.meta.env.VITE_API_UPDATE_ORDER
const host_name = import.meta.env.VITE_HOST_NAME_UPLOADS

const auth = JSON.parse(localStorage.getItem('auth'))

const Orders = () => {
  const [orders, setAllOrders] = useState([]) // State to hold all Orders data

  const fetchResetApi = async () => {
    const result = await callApiWithToken(api_show_orders, auth.token)
    setAllOrders(result.orders)
  }

  useEffect(() => {
    const fetchApi = async () => {
      const result = await callApiWithToken(api_show_orders, auth.token)
      setAllOrders(result.orders)
    }
    fetchApi()
  }, [])
  console.log(orders)

  const formatVND = (amount) => {
    amount = Number(amount)
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
  }

  const btnConfirmOrder = async (id) => {
    try {
      await axios.patch(`${api_update_orders}${id}`, {
        isConfirm: true,
      })
      fetchResetApi()
    } catch (error) {
      console.log('error: ', error)
    }
  }

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          <CCol sm={3}>
            <CFormInput type="text" size="sm" placeholder="search" aria-label="sm input example" />
          </CCol>
        </CCardHeader>
        <CCardBody>
          <CTable bordered striped hover>
            <CTableHead color="dark">
              <CTableRow>
                <CTableHeaderCell scope="col">ID Order</CTableHeaderCell>
                <CTableHeaderCell scope="col">Customer</CTableHeaderCell>
                <CTableHeaderCell scope="col">Product</CTableHeaderCell>
                <CTableHeaderCell scope="col">Total</CTableHeaderCell>
                <CTableHeaderCell scope="col">Payment Method</CTableHeaderCell>
                <CTableHeaderCell scope="col">Payment Status</CTableHeaderCell>
                <CTableHeaderCell scope="col">Confirm</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {orders.length > 0 ? (
                orders.map((order, index) => (
                  <CTableRow key={index}>
                    <CTableHeaderCell scope="row">{order?.idOrder}</CTableHeaderCell>
                    <CTableDataCell>{order?.userId}</CTableDataCell>
                    <CTableDataCell>
                      {order?.orderItems?.map((name, index) => (
                        <div key={index}>{name.name}</div>
                      ))}
                    </CTableDataCell>
                    <CTableDataCell>{formatVND(order?.total)}</CTableDataCell>
                    <CTableDataCell>{order?.paymentMethod}</CTableDataCell>
                    <CTableDataCell>{order?.paymentStatus || 'UNPAID'}</CTableDataCell>
                    <CTableDataCell>
                      {order.isConfirm === 1 ? (
                        <CButton color="success">Success</CButton>
                      ) : (
                        <CButton color="danger" onClick={() => btnConfirmOrder(order?.id)}>
                          Danger
                        </CButton>
                      )}
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <></>
              )}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </>
  )
}

export default Orders
