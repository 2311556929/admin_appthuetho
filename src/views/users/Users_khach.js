import axios from 'axios'
import { useState, useEffect } from 'react'
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
  CPagination,
  CPaginationItem,
  CBadge,
} from '@coreui/react'
import { CIcon } from '@coreui/icons-react'
import { cilTrash, cilFullscreen, cilPencil } from '@coreui/icons'
import { callApiByLimit } from '../../services/api.js'
import FormUpdareUser_khach from './FormUpdateUser_khach.js'

const api_show_users_by_limit = import.meta.env.VITE_API_SHOW_USERS_LIMIT
const api_delete_user = import.meta.env.VITE_API_DELETE_USER
const host_name = import.meta.env.VITE_HOST_NAME_UPLOADS

const Users = () => {
  const [allUsers, setAllUsers] = useState([]) // State to hold all users data
  const [update, setUpdate] = useState(false)
  const [page, setPage] = useState(1) // trang hiện tại
  const [limit] = useState(10) // số user mỗi trang
  const [totalPages, setTotalPages] = useState(1)

  const fetchResetApi = async () => {
    const result = await callApiByLimit(api_show_users_by_limit, page, limit) //res.data để nhận dữ liệu từ be gửi lên
    setAllUsers(result.users) // mảng user be gửi lên
    setTotalPages(result.totalPages) //totalPages từ be gửi lên fe
  }

  useEffect(() => {
    const fetchApi = async () => {
      const result = await callApiByLimit(api_show_users_by_limit, page, limit) //res.data để nhận dữ liệu từ be gửi lên
      setAllUsers(result.users) // mảng user be gửi lên
      setTotalPages(result.totalPages) //totalPages từ be gửi lên fe
    }
    fetchApi(page, limit)
  }, [page, limit])

  // show detail user
  const clickShowDetailUser = () => {
    setUpdate({ update: true, edit: false })
  }

  // edit user
  const clickEditUserById = () => {
    setUpdate({ update: true, edit: true })
  }

  // delete user
  const clickDeleteUserById = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa user này?')) return

    try {
      await axios.delete(`${api_delete_user}${id}`)
      setAllUsers((prev) => prev.filter((p) => p.idUser !== id))
      alert('Xóa user thành công!')
    } catch (err) {
      console.error('Lỗi khi xóa user:', err)
      alert('Xóa user thất bại!')
    }
    fetchResetApi()
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
          <CTable bordered striped hover className="text-center align-middle">
            <CTableHead color="dark" className="fs-6">
              <CTableRow>
                <CTableHeaderCell scope="col">Ảnh đại diện</CTableHeaderCell>
                <CTableHeaderCell scope="col">Tên Khách Hàng</CTableHeaderCell>
                <CTableHeaderCell scope="col">Địa chỉ</CTableHeaderCell>
                <CTableHeaderCell scope="col">SĐT</CTableHeaderCell>
                <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                <CTableHeaderCell scope="col">Trạng thái</CTableHeaderCell>
                <CTableHeaderCell scope="col">Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody className="fs-5">
              <CTableRow>
                <CTableHeaderCell scope="row">
                  <img
                    src="../../../demo_image/demo_avatar.png"
                    alt="ảnh đại diện"
                    className="user-image"
                  />
                </CTableHeaderCell>
                <CTableDataCell>Duy Tân</CTableDataCell>
                <CTableDataCell>8/5/18, Vườn lài, An Phú Đông, Quận 12</CTableDataCell>
                <CTableDataCell>0969884721</CTableDataCell>
                <CTableDataCell>Nguyenduytan.08052003@gmail.com</CTableDataCell>
                <CTableDataCell className="fs-4">
                  <CBadge color="danger">Không có đơn</CBadge>
                </CTableDataCell>
                <CTableDataCell>
                  <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                    <CButton color="info" onClick={() => clickShowDetailUser()}>
                      <CIcon icon={cilFullscreen} />
                    </CButton>
                    <CButton color="primary" onClick={() => clickEditUserById()}>
                      <CIcon icon={cilPencil} />
                    </CButton>
                    <CButton color="danger" onClick={() => clickDeleteUserById(user.idUser)}>
                      <CIcon icon={cilTrash} />
                    </CButton>
                  </div>
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
          {/* <CTable bordered striped hover>
            <CTableHead color="dark">
              <CTableRow>
                <CTableHeaderCell scope="col">User</CTableHeaderCell>
                <CTableHeaderCell scope="col">Full name</CTableHeaderCell>
                <CTableHeaderCell scope="col">User name</CTableHeaderCell>
                <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                <CTableHeaderCell scope="col">Phone number</CTableHeaderCell>
                <CTableHeaderCell scope="col">Role</CTableHeaderCell>
                <CTableHeaderCell scope="col">Address</CTableHeaderCell>
                <CTableHeaderCell scope="col">Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {allUsers.length > 0 ? (
                allUsers.map((user, index) => (
                  <CTableRow key={index}>
                    <CTableHeaderCell scope="row">
                      <img
                        src={`${host_name}${user.avatar}`}
                        alt={user.fullName}
                        className="user-image"
                      />
                      {}
                    </CTableHeaderCell>
                    <CTableDataCell>{user.fullName}</CTableDataCell>
                    <CTableDataCell>{user.userName}</CTableDataCell>
                    <CTableDataCell>{user.email}</CTableDataCell>
                    <CTableDataCell>{user.phone}</CTableDataCell>
                    <CTableDataCell>{user.role}</CTableDataCell>
                    <CTableDataCell>{user.addresses}</CTableDataCell>
                    <CTableDataCell>
                      <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                        <CButton color="info" onClick={() => clickShowDetailUser(user.idUser)}>
                          <CIcon icon={cilFullscreen} />
                        </CButton>
                        <CButton color="primary" onClick={() => clickEditUserById(user)}>
                          <CIcon icon={cilPencil} />
                        </CButton>
                        <CButton color="danger" onClick={() => clickDeleteUserById(user.idUser)}>
                          <CIcon icon={cilTrash} />
                        </CButton>
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <></>
              )}
            </CTableBody>
          </CTable> */}
          {/* ---------------------PHÂN TRANG---------------------- */}
          <CPagination align="center">
            <CPaginationItem
              aria-label="Previous"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              &laquo;
            </CPaginationItem>

            {Array.from({ length: totalPages }, (_, i) => (
              <CPaginationItem key={i + 1} active={i + 1 === page} onClick={() => setPage(i + 1)}>
                {i + 1}
              </CPaginationItem>
            ))}

            <CPaginationItem
              aria-label="Next"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              &raquo;
            </CPaginationItem>
          </CPagination>
          {/* ------------------------------------------- */}
        </CCardBody>
      </CCard>
      {/* truyền prop cho FormUpdareUser giá trị onClose và setUpdate(flase) để bên FormUpdareUser viết sự kiện onClick để thực thi Cancel */}
      {update && (
        <FormUpdareUser_khach
          visible={update.update}
          product={{ '': '' }}
          Cancel={() => setUpdate(false)}
          fetchResetApi={fetchResetApi}
          edit={update.edit}
        />
      )}
    </>
  )
}

export default Users
