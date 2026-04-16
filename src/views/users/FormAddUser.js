import { useEffect, useState, useRef } from 'react'
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
  CFormTextarea,
  CFormCheck,
  CFormSelect,
} from '@coreui/react'
import { CIcon } from '@coreui/icons-react'
import { cilCloudUpload } from '@coreui/icons'
import imageUpLoadEmpty from '/public/image.png'
import { v4 as uuidv4 } from 'uuid' // thư viện cung cấp id unique toàn cầu
import { callApi } from '../../services/api.js'

const api_all_role = import.meta.env.VITE_API_SHOW_ROLE
const api_add_users = import.meta.env.VITE_API_ADD_USER

function FormAddUser() {
  const navigate = useNavigate() // hook của react-router-dom , dùng để chuyển page

  const inputFileRef = useRef(null)

  const [containerUser, setContainerUser] = useState({
    id: '',
    idUser: '',
    fullName: '',
    email: '',
    userName: '',
    password: '',
    phone: '',
    role: '',
    permissions: '',
    avatar: '',
    addresses: '',
    isVerified: '',
  })

  const [previewAvatar, setPreviewAvatar] = useState([]) // show image trực tiếp sau khi chọn file
  const [avatarFile, setAvatarFile] = useState([])
  const [apiRole, setApiRole] = useState([])

  useEffect(() => {
    const fetchRoleApi = async () => {
      try {
        const result = await callApi(api_all_role)
        setApiRole(result.role)
      } catch (error) {
        console.log('fetchApi error:', error)
      }
    }
    fetchRoleApi()
  }, [])

  const valueRole = apiRole.map((value) => ({
    label: value.roleName,
    value: value.roleName,
  }))

  const valuePermissions = apiRole.map((value) => ({
    label: value.permissions,
    value: value.permissions,
  }))

  // Khi người dùng chọn file thumnail
  const handleFileAvatar = (e) => {
    const files = Array.from(e.target.files)
    const previewAvatar = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))
    setPreviewAvatar(previewAvatar)
    setAvatarFile(files)
  }

  // function use uuid , create id
  const randomIdProduct = () => {
    return `${uuidv4()}`
  }

  // event follow form input
  const handleInputForm = (e) => {
    const { name, value, type, checked } = e.target

    setContainerUser((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSelectionFormRole = () => {}

  // button add publish send request to server
  const clickAddUser = async () => {
    const formData = new FormData()

    const finalUser = {
      ...containerUser,
      idUser: randomIdProduct(),
    }
    formData.append('avatarFile', avatarFile[0])
    formData.append('FinalUser', JSON.stringify(finalUser))

    try {
      await axios.post(`${api_add_users}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      alert('Tạo sản phẩm thành công!')
      navigate('/allusers')
    } catch (err) {
      alert('Tạo sản phẩm Không thành công!')
      console.error('Lỗi khi tạo sản phẩm:', err)
    }
  }

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          <CCol sm={3}>
            <CButton
              color="primary"
              type="submit"
              className="fw-bold mb-2 mt-2"
              onClick={() => clickAddUser()}
            >
              PUBLISH <CIcon icon={cilCloudUpload} size="lg" />
            </CButton>
          </CCol>
        </CCardHeader>
        <CCardBody>
          <CForm>
            <CRow>
              <CCol sm={3}>
                {/* Ẩn input file */}
                <CFormInput
                  className="mb-3 avatar-add"
                  type="file"
                  multiple
                  name="avatar"
                  onChange={handleFileAvatar}
                  ref={inputFileRef}
                  style={{ display: 'none' }}
                />

                {/* Hiển thị ảnh xem trước */}
                {previewAvatar.length > 0 ? (
                  previewAvatar.map((img, index) => (
                    <img
                      className="mb-3 avatar-add"
                      key={index}
                      src={img.preview}
                      alt={`preview-${index}`}
                      onClick={() => inputFileRef.current.click()} // click vào ảnh mở file picker
                    />
                  ))
                ) : (
                  <img
                    className="mb-3 avatar-add"
                    src={imageUpLoadEmpty}
                    alt="upload image"
                    onClick={() => inputFileRef.current.click()} // click vào ảnh mở file picker
                  />
                )}
              </CCol>
              <CCol sm={9}>
                <CRow>
                  <CCol sm={6}>
                    <CFormInput
                      className="mb-3"
                      type="text"
                      label="Họ Tên Thợ"
                      name="fullName"
                      value={containerUser.fullName}
                      onChange={handleInputForm}
                    />
                    <CFormInput
                      className="mb-3"
                      type="text"
                      label="Tên đăng nhập"
                      name="userName"
                      value={containerUser.userName}
                      onChange={handleInputForm}
                    />
                  </CCol>
                  <CCol sm={6}>
                    <CFormInput
                      className="mb-3"
                      type="text"
                      label="Email"
                      name="email"
                      value={containerUser.email}
                      onChange={handleInputForm}
                    />
                    <CFormInput
                      className="mb-3"
                      type="text"
                      label="Số điện thoại"
                      name="phone"
                      value={containerUser.phone}
                      onChange={handleInputForm}
                    />
                  </CCol>
                </CRow>
                <CRow>
                  <CCol sm={6}>
                    <CFormInput
                      className="mb-3"
                      type="text"
                      label="Mật khẩu"
                      name="password"
                      value={containerUser.password}
                      onChange={handleInputForm}
                    />
                    {/* <CFormInput
                      className="mb-3"
                      type="text"
                      label="Confirm password"
                      name="confirm password"
                      value={containerUser.password}
                      onChange={handleInputForm}
                    /> */}
                  </CCol>
                  <CCol sm={6}>
                    <CFormInput
                      className="mb-3"
                      type="text"
                      label="Địa chỉ cửa hàng làm việc"
                      name="addresses"
                      value={containerUser.addresses}
                      onChange={handleInputForm}
                    />
                    <CFormSelect
                      className="mb-3"
                      label="Vai trò"
                      name="role"
                      options={[{ label: '- - - Chọn vai trò - - -', value: '' }, ...valueRole]}
                      onChange={(e) => handleSelectionFormRole(e)}
                    />
                    <CFormSelect
                      className="mb-3"
                      label="Phân quyền"
                      name="permissions"
                      options={[
                        { label: '- - - Chọn phân quyền - - -', value: '' },
                        ...valuePermissions,
                      ]}
                      onChange={(e) => handleSelectionFormRole(e)}
                    />
                  </CCol>
                </CRow>
              </CCol>
            </CRow>
          </CForm>
        </CCardBody>
      </CCard>
    </>
  )
}

export default FormAddUser
