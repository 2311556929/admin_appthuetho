import { use, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import axios from 'axios'
import {
  CCard,
  CCardHeader,
  CRow,
  CCol,
  CCardBody,
  CForm,
  CFormInput,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CTableBody,
} from '@coreui/react'
import { CIcon } from '@coreui/icons-react'
import { cilTrash, cilPencil, cilCloudUpload } from '@coreui/icons'
import { callApi } from '../../services/api'

// define api link
const api_all_role = import.meta.env.VITE_API_SHOW_ROLE
const api_add_role = import.meta.env.VITE_API_ADD_ROLE
const api_update_role = import.meta.env.VITE_API_UPDATE_ROLE
const api_delete_role = import.meta.env.VITE_API_DELETE_ROLE

function FormAddRole() {
  const [allRole, setAllRole] = useState([]) // chứa data từ api brand
  const [containerRole, setContainerRole] = useState({ id: '', roleName: '', permissions: '' })

  const CBFetchAllRole = async () => {
    //nếu tách fetchAllRole khỏi useEffect thì bị báo lỗi eslint nên tạo hẳn hàm mới cho việc gọi lại api khi CRUD status mới
    try {
      const result = await callApi(api_all_role)
      setAllRole(result.role)
    } catch (error) {
      console.log('call api error:', error)
    }
  }
  useEffect(() => {
    const fetchAllRole = async () => {
      try {
        const result = await callApi(api_all_role)
        setAllRole(result.role)
      } catch (error) {
        console.log('call api error:', error)
      }
    }
    fetchAllRole()
  }, [])

  // event follow form input
  const handleChange = (e) => {
    const { name, value } = e.target
    setContainerRole((prev) => ({ ...prev, [name]: value || '' }))
  }

  const clickAddOrUpdateRole = () => {
    if (containerRole.id === '') {
      addRole()
    } else {
      updateRole(containerRole.id)
    }
  }

  // button add publish send request to server
  const addRole = async () => {
    const formData = new FormData()

    formData.append('roleName', containerRole.roleName)
    formData.append('permissions', containerRole.permissions)
    try {
      const res = await axios.post(`${api_add_role}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      alert('thêm role thành công!')
      console.log(res.data)
    } catch (err) {
      console.error('Lỗi khi tạo role:', err)
    }

    CBFetchAllRole()
    setContainerRole({ id: '', roleName: '', permissions: '' })
  }

  // edit brand
  const clickShowEditRoleById = async (id, roleName, permissions) => {
    setContainerRole({ id, roleName, permissions })
  }

  const updateRole = async (id) => {
    const formData = new FormData()

    formData.append('roleName', containerRole.roleName)
    formData.append('permissions', containerRole.permissions)
    try {
      await axios.put(`${api_update_role}${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      alert('Sửa role thành công!')
      CBFetchAllRole() // reload list
    } catch (err) {
      console.error('Lỗi khi sửa brand:', err)
      alert('Sửa role thất bại!')
    }
    // reload list và reset form
    CBFetchAllRole()
    setContainerRole({ id: '', roleName: '', permissions: '' })
  }

  // button cancel update
  const clickUpdateRole = () => {
    setContainerRole({ id: '', roleName: '', permissions: '' })
  }

  // delete role
  const clickDeleteStausById = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa role này?')) return

    try {
      await axios.delete(`${api_delete_role}${id}`)
      alert('Xóa role thành công!')
    } catch (err) {
      console.error('Lỗi khi xóa role:', err)
      alert('Xóa role thất bại!')
    }
    // reload list và reset form
    CBFetchAllRole()
    setContainerRole({ id: '', roleName: '', permissions: '' })
  }
  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          <CCol sm={3} className="d-flex gap-4">
            <CButton
              color="primary"
              type="submit"
              className="fw-bold mb-2 mt-2"
              onClick={() => clickAddOrUpdateRole()}
            >
              PUBLISH <CIcon icon={cilCloudUpload} size="lg" />
            </CButton>
            {containerRole.id !== '' && (
              <CButton
                color="primary"
                type="submit"
                className="fw-bold mb-2 mt-2"
                onClick={() => clickUpdateRole()}
              >
                CANCEL <CIcon icon={cilPencil} size="lg" />
              </CButton>
            )}
          </CCol>
        </CCardHeader>
        <CCardBody>
          <CForm>
            <CRow>
              <CCol sm={4}>
                <CRow>
                  <CCol sm={12}>
                    <CFormInput
                      className="mb-3"
                      type="text"
                      label="Role name"
                      name="roleName"
                      value={containerRole.roleName}
                      onChange={handleChange}
                    />
                    <CFormInput
                      className="mb-3"
                      type="text"
                      label="Permissions"
                      name="permissions"
                      value={containerRole.permissions}
                      onChange={handleChange}
                    />
                  </CCol>
                </CRow>
              </CCol>
              <CCol sm={8}>
                <CCardBody>
                  <CTable bordered striped hover>
                    <CTableHead color="dark">
                      <CTableRow>
                        <CTableHeaderCell scope="col">Status name</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Permissions</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {allRole.length > 0 ? (
                        allRole.map((role, index) => (
                          <CTableRow key={index}>
                            <CTableDataCell>{role.roleName}</CTableDataCell>
                            <CTableDataCell>{role.permissions}</CTableDataCell>
                            <CTableDataCell>
                              <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                                <CButton
                                  color="primary"
                                  onClick={() =>
                                    clickShowEditRoleById(role.id, role.roleName, role.permissions)
                                  }
                                >
                                  <CIcon icon={cilPencil} />
                                </CButton>
                                <CButton
                                  color="danger"
                                  onClick={() => clickDeleteStausById(role.id)}
                                >
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
                  </CTable>
                </CCardBody>
              </CCol>
            </CRow>
          </CForm>
        </CCardBody>
      </CCard>
    </>
  )
}

export default FormAddRole
