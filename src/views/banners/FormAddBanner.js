import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  CCard,
  CCardHeader,
  CRow,
  CCol,
  CCardBody,
  CForm,
  CFormInput,
  CFormLabel,
  CFormCheck,
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
import imageUpLoad from '/public/image.png'
import { callApi } from '../../services/api'

const api_all_banners = import.meta.env.VITE_API_SHOW_BANNERS
const api_add_banner = import.meta.env.VITE_API_ADD_BANNER
const api_update_banner = import.meta.env.VITE_API_UPDATE_BANNER
const api_delete_banner = import.meta.env.VITE_API_DELETE_BANNER
const host_name_uploads = import.meta.env.VITE_HOST_NAME_UPLOADS

function FormAddBanner() {
  const [allBanners, setAllBanners] = useState([])
  const [bannerData, setBannerData] = useState({
    id: '',
    title: '',
    link: '',
    isActive: false,
    startDate: '',
    endDate: '',
    image: '',
  })
  const [previewImages, setPreviewImages] = useState([])
  const [image, setImage] = useState([])
  const [imageUpLoadEmpty, setImageUpLoadEmpty] = useState(imageUpLoad)

  // gọi API để lấy tất cả banner
  const fetchAllBanners = async () => {
    try {
      const result = await callApi(api_all_banners)
      setAllBanners(result.banners || [])
    } catch (error) {
      console.log('call api error:', error)
    }
  }

  useEffect(() => {
    fetchAllBanners()
  }, [])

  // Khi người dùng chọn file
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    const previewImage = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))
    setPreviewImages(previewImage)
    setImage(files)
  }

  // event theo form input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setBannerData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const clickAddOrUpdateBanner = () => {
    if (bannerData.id === '') {
      addBanner()
    } else {
      updateBanner(bannerData.id)
    }
  }

  // Add banner
  const addBanner = async () => {
    const formData = new FormData()
    formData.append('title', bannerData.title)
    formData.append('link', bannerData.link)
    formData.append('isActive', bannerData.isActive ? 1 : 0)
    formData.append('startDate', bannerData.startDate)
    formData.append('endDate', bannerData.endDate)
    if (image.length > 0) formData.append('image', image[0])

    try {
      const res = await axios.post(api_add_banner, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      alert('Thêm banner thành công!')
      console.log(res.data)
    } catch (err) {
      console.error('Lỗi khi tạo banner:', err)
      alert('Thêm banner thất bại!')
    }

    fetchAllBanners()
    resetForm()
  }

  // Update banner
  const updateBanner = async (id) => {
    const formData = new FormData()
    formData.append('title', bannerData.title)
    formData.append('link', bannerData.link)
    formData.append('isActive', bannerData.isActive ? 1 : 0)
    formData.append('startDate', bannerData.startDate)
    formData.append('endDate', bannerData.endDate)
    if (image.length > 0) formData.append('image', image[0])

    try {
      await axios.patch(`${api_update_banner}${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      alert('Sửa banner thành công!')
    } catch (err) {
      console.error('Lỗi khi sửa banner:', err)
      alert('Sửa banner thất bại!')
    }

    fetchAllBanners()
    resetForm()
  }

  // Show edit
  const clickShowEditBannerById = (banner) => {
    setBannerData({
      id: banner.id,
      title: banner.title,
      link: banner.link || '',
      isActive: banner.isActive === 1,
      startDate: banner.startDate ? banner.startDate.split('T')[0] : '',
      endDate: banner.endDate ? banner.endDate.split('T')[0] : '',
      image: banner.image || '',
    })
    setImageUpLoadEmpty(`${host_name_uploads}${banner.image}`)
  }

  // Delete banner
  const clickDeleteBannerById = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa banner này?')) return

    try {
      await axios.delete(`${api_delete_banner}${id}`)
      alert('Xóa banner thành công!')
    } catch (err) {
      console.error('Lỗi khi xóa banner:', err)
      alert('Xóa banner thất bại!')
    }

    fetchAllBanners()
    resetForm()
  }

  // Reset form
  const resetForm = () => {
    setBannerData({
      id: '',
      title: '',
      link: '',
      isActive: false,
      startDate: '',
      endDate: '',
      image: '',
    })
    setPreviewImages([])
    setImage([])
    setImageUpLoadEmpty(imageUpLoad)
  }

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          <CCol sm={12} className="d-flex gap-4">
            <CButton
              color="primary"
              type="submit"
              className="fw-bold mb-2 mt-2"
              onClick={clickAddOrUpdateBanner}
            >
              PUBLISH <CIcon icon={cilCloudUpload} size="lg" />
            </CButton>
            {bannerData.id !== '' && (
              <CButton
                color="primary"
                type="submit"
                className="fw-bold mb-2 mt-2"
                onClick={resetForm}
              >
                CANCEL <CIcon icon={cilPencil} size="lg" />
              </CButton>
            )}
          </CCol>
        </CCardHeader>
        <CCardBody>
          <CForm>
            <CRow>
              <CCol sm={3}>
                <CFormInput
                  type="text"
                  label="Title"
                  name="title"
                  value={bannerData.title}
                  onChange={handleChange}
                  className="mb-3"
                />
                <CFormInput
                  type="text"
                  label="Link"
                  name="link"
                  value={bannerData.link}
                  onChange={handleChange}
                  className="mb-3"
                />
                <CFormCheck
                  label="Active"
                  name="isActive"
                  checked={bannerData.isActive}
                  onChange={handleChange}
                  className="mb-3"
                />
                <CFormLabel>Start Date</CFormLabel>
                <CFormInput
                  type="date"
                  name="startDate"
                  value={bannerData.startDate}
                  onChange={handleChange}
                  className="mb-3"
                />
                <CFormLabel>End Date</CFormLabel>
                <CFormInput
                  type="date"
                  name="endDate"
                  value={bannerData.endDate}
                  onChange={handleChange}
                  className="mb-3"
                />
                <CFormLabel>Upload Image</CFormLabel>
                <CFormInput type="file" multiple onChange={handleFileChange} className="mb-3" />
                {previewImages.length > 0
                  ? previewImages.map((img, idx) => (
                      <img
                        key={idx}
                        src={img.preview}
                        alt={`preview-${idx}`}
                        className="img-fluid rounded shadow-sm mb-2"
                      />
                    ))
                  : bannerData.image && (
                      <img
                        src={imageUpLoadEmpty}
                        alt="banner"
                        className="img-fluid rounded shadow-sm mb-2"
                      />
                    )}
              </CCol>
              <CCol sm={9}>
                <CTable bordered striped hover>
                  <CTableHead color="dark">
                    <CTableRow>
                      <CTableHeaderCell>Image</CTableHeaderCell>
                      <CTableHeaderCell>Title</CTableHeaderCell>
                      <CTableHeaderCell>Link</CTableHeaderCell>
                      <CTableHeaderCell>Active</CTableHeaderCell>
                      <CTableHeaderCell>Start Date</CTableHeaderCell>
                      <CTableHeaderCell>End Date</CTableHeaderCell>
                      <CTableHeaderCell>Action</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {allBanners.length > 0 &&
                      allBanners.map((banner) => (
                        <CTableRow key={banner.id}>
                          <CTableDataCell>
                            {banner.image && (
                              <img
                                src={`${host_name_uploads}${banner.image}`}
                                alt={banner.title}
                                style={{ width: '100px', height: 'auto' }}
                              />
                            )}
                          </CTableDataCell>
                          <CTableDataCell>{banner.title}</CTableDataCell>
                          <CTableDataCell>{banner.link}</CTableDataCell>
                          <CTableDataCell>{banner.isActive === 1 ? 'Yes' : 'No'}</CTableDataCell>
                          <CTableDataCell>{banner.startDate?.split('T')[0]}</CTableDataCell>
                          <CTableDataCell>{banner.endDate?.split('T')[0]}</CTableDataCell>
                          <CTableDataCell>
                            <CButton
                              color="primary"
                              onClick={() => clickShowEditBannerById(banner)}
                              className="me-2"
                            >
                              <CIcon icon={cilPencil} />
                            </CButton>
                            <CButton
                              color="danger"
                              onClick={() => clickDeleteBannerById(banner.id)}
                            >
                              <CIcon icon={cilTrash} />
                            </CButton>
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                  </CTableBody>
                </CTable>
              </CCol>
            </CRow>
          </CForm>
        </CCardBody>
      </CCard>
    </>
  )
}

export default FormAddBanner
