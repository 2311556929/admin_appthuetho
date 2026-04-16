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

const api_all_categories = import.meta.env.VITE_API_SHOW_CATEGORIES
const api_add_category = import.meta.env.VITE_API_ADD_CATEGORY
const api_update_category = import.meta.env.VITE_API_UPDATE_CATEGORY
const api_delete_category = import.meta.env.VITE_API_DELETE_CATEGORY
const host_name_uploads = import.meta.env.VITE_HOST_NAME_UPLOADS

function FormAddCategory() {
  const [allCategories, setAllCategories] = useState([]) // chứa data từ api brand
  const [containerCategories, setContainerCategories] = useState({
    id: '',
    nameCategory: '',
    logo: '',
  })
  const [previewImages, setPreviewImages] = useState([]) // show image trực tiếp sau khi chọn file
  const [image, setImage] = useState([])
  const [imageUpLoadEmpty, setImageUpLoadEmpty] = useState(imageUpLoad)
  // gọi api và thực hiện show brand
  const CBFetchAllCategories = async () => {
    //nếu tách fetchAllcategorykhỏi useEffect thì bị báo lỗi eslint nên tạo hẳn hàm mới cho việc gọi lại api khi CRUD categorymới
    try {
      const result = await callApi(api_all_categories)
      setAllCategories(result.categories)
    } catch (error) {
      console.log('call api error:', error)
    }
  }
  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const result = await callApi(api_all_categories)
        setAllCategories(result.categories || [])
      } catch (error) {
        console.log('call api error:', error)
      }
    }
    fetchAllCategories()
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
    console.log(e.target.files[0])
  }

  // event follow form input
  const handleChange = (e) => {
    const { name, value } = e.target
    setContainerCategories((prev) => ({ ...prev, [name]: value || '' }))

    console.log(containerCategories)
  }
  const clickAddOrUpdateCategory = () => {
    if (containerCategories.id === '') {
      addCategory()
    } else {
      updateCategory(containerCategories.id)
    }
  }

  // button add publish send request to server
  const addCategory = async () => {
    const formData = new FormData()

    formData.append('logo', image[0])
    formData.append('nameCategory', containerCategories.nameCategory)

    try {
      const res = await axios.post(`${api_add_category}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      alert('thêm categorythành công!')
      console.log(res.data)
    } catch (err) {
      console.error('Lỗi khi tạo brand:', err)
    }
    // reload list và reset form
    CBFetchAllCategories()
    setContainerCategories({ id: '', nameCategory: '', logo: '' })
    setImageUpLoadEmpty(imageUpLoad)
    setPreviewImages([])
    setImage([])
  }

  // edit brand
  const clickShowEditCategoryById = async (id, nameCategory, logo) => {
    setContainerCategories({ id, nameCategory })
    setImageUpLoadEmpty(`${host_name_uploads}${logo}`)
  }

  const updateCategory = async (id) => {
    const formData = new FormData()
    formData.append('nameCategory', containerCategories.nameCategory)
    if (image.length > 0) formData.append('logo', image[0]) // chỉ append nếu có ảnh mới

    try {
      await axios.patch(`${api_update_category}${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      alert('Sửa categorythành công!')
    } catch (err) {
      console.error('Lỗi khi sửa brand:', err)
      alert('Sửa categorythất bại!')
    }
    // reload list và reset form
    CBFetchAllCategories()
    setContainerCategories({ id: '', nameCategory: '', logo: '' })
    setImageUpLoadEmpty(imageUpLoad)
    setPreviewImages([])
    setImage([])
  }
  // button cancel update
  const clickUpdateCategory = () => {
    setContainerCategories({ id: '', nameCategory: '', logo: '' })
    setImageUpLoadEmpty(imageUpLoad)
    setPreviewImages([])
    setImage([])
  }

  // delete brand
  const clickDeleteProductById = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa category này?')) return

    try {
      await axios.delete(`${api_delete_category}${id}`)
      alert('Xóa categorythành công!')
    } catch (err) {
      console.error('Lỗi khi xóa brand:', err)
      alert('Xóa category thất bại!')
    }
    // reload list và reset form
    CBFetchAllCategories()
    setContainerCategories({ id: '', nameCategory: '', logo: '' })
    setImageUpLoadEmpty(imageUpLoad)
    setPreviewImages([])
    setImage([])
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
              onClick={() => clickAddOrUpdateCategory()}
            >
              PUBLISH <CIcon icon={cilCloudUpload} size="lg" />
            </CButton>
            {containerCategories.id !== '' && (
              <CButton
                color="primary"
                type="submit"
                className="fw-bold mb-2 mt-2"
                onClick={() => clickUpdateCategory()}
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
                      label="Tên dịch vụ"
                      name="nameCategory"
                      value={containerCategories.nameCategory}
                      onChange={handleChange}
                    />
                  </CCol>
                  <CCol>
                    <CFormInput
                      className="mb-3"
                      type="file"
                      id="formFileMultiple"
                      label="Upload images"
                      multiple
                      onChange={handleFileChange}
                    />
                    {/* Hiển thị ảnh xem trước */}
                    {previewImages.length > 0 ? (
                      previewImages.map((img, index) => (
                        <img
                          key={index}
                          src={img.preview}
                          alt={`preview-${index}`}
                          className="img-fluid rounded shadow-sm"
                          style={{
                            width: '100%',
                            height: 'auto',
                            objectFit: 'cover',
                          }}
                        />
                      ))
                    ) : (
                      <>
                        <img
                          src={imageUpLoadEmpty}
                          alt="upload image"
                          className="img-fluid rounded shadow-sm "
                          style={{
                            width: '100%',
                            height: 'auto',
                            objectFit: 'cover',
                          }}
                        />
                      </>
                    )}
                  </CCol>
                </CRow>
              </CCol>
              <CCol sm={8}>
                <CCardBody>
                  <CTable bordered striped hover>
                    <CTableHead color="dark">
                      <CTableRow>
                        <CTableHeaderCell scope="col">Logo</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Tên dịch vụ</CTableHeaderCell>

                        <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {allCategories.length > 0 ? (
                        allCategories.map((category, index) => (
                          <CTableRow key={index}>
                            <CTableHeaderCell scope="row">
                              <img
                                src={`${host_name_uploads}${category.logo}`}
                                alt={category.logo}
                                className="brand-image"
                              />
                            </CTableHeaderCell>
                            <CTableDataCell>{category.nameCategory}</CTableDataCell>

                            <CTableDataCell>
                              <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                                <CButton
                                  color="primary"
                                  onClick={() =>
                                    clickShowEditCategoryById(
                                      category.idCate,
                                      category.nameCategory,
                                      category.logo,
                                    )
                                  }
                                >
                                  <CIcon icon={cilPencil} />
                                </CButton>
                                <CButton
                                  color="danger"
                                  onClick={() => clickDeleteProductById(category.idCate)}
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

export default FormAddCategory
