import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  CButton,
  CModal,
  CModalBody,
  CCard,
  CCardHeader,
  CRow,
  CCardBody,
  CCardImage,
  CCardLink,
  CCardText,
  CCardTitle,
  CListGroup,
  CListGroupItem,
  CCol,
  CForm,
  CFormInput,
  CFormTextarea,
  CFormCheck,
  CFormSelect,
  CBadge,
  CWidgetStatsA,
} from '@coreui/react'
import { CIcon } from '@coreui/icons-react'
import { cilCloudUpload, cilPencil, cilX } from '@coreui/icons'
import imageUpLoadEmpty from '/public/image.png'
import { callApi } from '../../services/api.js'

const api_all_brands = import.meta.env.VITE_API_SHOW_BRANDS
const api_all_categories = import.meta.env.VITE_API_SHOW_CATEGORIES
const api_all_specs = import.meta.env.VITE_API_SHOW_SPECS
const api_update_products = import.meta.env.VITE_API_UPDATE_PRODUCT
const host_name = import.meta.env.VITE_HOST_NAME_UPLOADS

const FormUpdateUser_tho = ({ visible, product, Cancel, fetchResetApi, edit }) => {
  const navigate = useNavigate() // hook của react-router-dom , dùng để chuyển page

  const [containerProduct, setContainerProduct] = useState({
    idProduct: product?.idProduct,
    slug: product?.slug,
    nameProduct: product?.nameProduct,
    categoryId: product?.categoryId,
    brandId: product?.brandId,
    price: product?.price,
    originalPrice: product?.originalPrice,
    discountPercent: product?.discountPercent,
    thumbnail: product?.thumbnail,
    shortDesc: product?.shortDesc,
    description: product?.description,
    status: product?.status,
    isFeatured: product?.isFeatured,
    allowInstallment: product?.allowInstallment,
    allowOnlinePrice: product?.allowOnlinePrice,
  })
  console.log(product.categoryId)
  console.log(product.brandId)

  const [containerSpec, setContainerSpec] = useState({
    screenSize: product?.specs?.screenSize || '',
    screenTechnology: product?.specs?.screenTechnology || '',
    rearCamera: product?.specs?.rearCamera || '',
    frontCamera: product?.specs?.frontCamera || '',
    chipset: product?.specs?.chipset || '',
    internalMemory: product?.specs?.internalMemory || '',
    battery: product?.specs?.battery || '',
    operatingSystem: product?.specs?.operatingSystem || '',
    screenResolution: product?.specs?.screenResolution || '',
    screenFeatures: product?.specs?.screenFeatures || '',
    cpuType: product?.specs?.cpuType || '',
    compatibility: product?.specs?.compatibility || '',
    quantity: product?.specs?.quantity || '',
  })

  const [previewThumbnail, setPreviewThumbnail] = useState(
    product.thumbnail ? [{ preview: `${host_name}${product.thumbnail}` }] : [],
  ) // show image trực tiếp sau khi chọn file

  const [previewImages, setPreviewImages] = useState(
    product.images?.map((img) => ({
      preview: `${host_name}${img.imageUrl}`,
    })) || [],
  ) // show image trực tiếp sau khi chọn file

  const [thumbnailFile, setThumbnail] = useState([])
  const [imagesFile, setImagesFile] = useState([])
  const [apiBrands, setApiBrands] = useState([])
  const [apiCategories, setApiCategories] = useState([])
  const [apiSpecs, setApiSpecs] = useState([])

  useEffect(() => {
    const fetchApi = async () => {
      try {
        // call api BRANDS
        const resultApiBrands = await callApi(api_all_brands)
        setApiBrands(resultApiBrands.brands)

        // call api CATEGORIES
        const resultApiCategories = await callApi(api_all_categories)
        setApiCategories(resultApiCategories.categories)

        // call api SPECS
        const resultApiSpecs = await callApi(api_all_specs)
        setApiSpecs(resultApiSpecs.specs)
      } catch (error) {
        console.log('fetchApi error:', error)
      }
    }
    fetchApi()
  }, [])

  const formatVND = (amount) => {
    amount = Number(amount)
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
  }

  // sửa chuỗi , tách khoảng với trước chữ in hoa và in hoa chữ
  function formatLabel(text) {
    return text
      .replace(/([a-z])([A-Z])/g, '$1 $2') // không tách giữa chữ viết tắt
      .replace(/^./, (char) => char.toUpperCase())
  }

  // nhận id trả ra nameBrand
  const getBransNameById = (id) => apiBrands.find((item) => item.idBrand == id)?.nameBrand || ''

  // khai báo để hiển thị ra giá trị của apiBrands cho vào formselect
  const valueApiBrands = apiBrands?.map((item) => ({
    label: item.nameBrand,
    value: item.idBrand,
  }))

  // nhận id trả ra nameCategory
  const getCategoryNameById = (id) =>
    apiCategories.find((item) => item.idCate == id)?.nameCategory || ''

  // khai báo để hiển thị ra giá trị của apiCategories cho vào formSelect
  const valueApiCategories = apiCategories?.map((item) => ({
    label: item.nameCategory,
    value: item.idCate,
  }))

  // lấy ra key của spec
  // sử dụng useMemo để ko phải render lại khi thao tác , chỉ thay đổi khi apiSpecs có sự thay đổi
  const specKeys = useMemo(() => {
    return Object.keys(apiSpecs[0] || {})
      .filter((key) => key !== 'id')
      .map((key) => ({
        label: key,
        value: key,
      }))
  }, [apiSpecs])

  // khai báo hàm để hiển thị ra giá trị của apiSpecs theo key nhận được và cho vào formSelect
  const valueApiSpecs = useMemo(() => {
    const obj = {}
    specKeys.forEach((key) => {
      obj[key.value] = apiSpecs
        .filter((item) => item[key.value])
        .map((item) => ({
          label: formatLabel(item[key.value]),
          value: item[key.value] || '',
        }))
    })
    return obj
  }, [apiSpecs, specKeys])

  // Khi người dùng chọn file thumnail
  const handleFileThumbnail = (e) => {
    const files = Array.from(e.target.files)
    const getPreviewThumbnail = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))
    setPreviewThumbnail(getPreviewThumbnail)
    setThumbnail(files)
  }

  // Multiple photos
  // sử dụng useCallback để ko phải render khi ko cần thiết
  const handleFileImagesProduct = useCallback((e) => {
    const files = Array.from(e.target.files)
    const previewImage = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))
    setPreviewImages(previewImage)
    setImagesFile(files)
  }, [])

  // create slug by name product
  const createSlugByNameProduct = (nameProduct) => {
    return nameProduct.toLowerCase().replace(/\s+/g, '-')
  }

  // event follow form input
  const handleInputForm = (e) => {
    const { name, value, type, checked } = e.target

    setContainerProduct((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'nameProduct' && { slug: createSlugByNameProduct(value) }),
    }))
  }

  const handleInputSpec = (e) => {
    const { name, value } = e.target
    setContainerSpec((prev) => ({ ...prev, [name]: value }))
  }

  // event selection form
  const handleSelectionFormProduct = (e) => {
    const { name, value } = e.target
    setContainerProduct((prev) => ({ ...prev, [name]: value }))

    // console.log(containerSpec)
  }

  const handleSelectionFormSpecs = (e, key) => {
    const { value } = e.target
    setContainerSpec((prev) => ({ ...prev, [key]: value }))

    // console.log(containerSpec)
  }

  // button add publish send request to server
  const clickAddProduct = async () => {
    const formData = new FormData()

    const finalProduct = {
      ...containerProduct,
      specs: [containerSpec], // bọc trong mảng ở backend khai specs là 1 bảng riêng
      images: imagesFile.map((file) => file.name),
    }

    formData.append('thumbnailPath', thumbnailFile[0])

    imagesFile.forEach((file) => {
      formData.append('imagesFile', file)
    })

    formData.append('FinalProduct', JSON.stringify(finalProduct))
    console.log(imagesFile)
    console.log(thumbnailFile)
    try {
      await axios.patch(`${api_update_products}${containerProduct.idProduct}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      alert('cập nhập sản phẩm thành công!')
    } catch (err) {
      console.error('Lỗi khi cập nhập sản phẩm:', err)
    }
    fetchResetApi()
    Cancel(true)
    navigate('/allproducts')
  }
  return (
    <>
      <CModal
        size="xl"
        visible={visible}
        backdrop="static"
        aria-labelledby="ScrollingLongContentExampleLabel"
      >
        <CModalBody>
          {edit == false ? (
            <CCardHeader className="d-flex justify-content-md-end  mb-2">
              <CIcon
                icon={cilX}
                width="30"
                height="30"
                className="d-flex justify-content-center align-items-center"
                type="submit"
                onClick={Cancel}
              />
            </CCardHeader>
          ) : (
            <CCardHeader>
              <CCol sm={3} className="d-flex gap-4">
                <CButton
                  color="primary"
                  type="submit"
                  className="fw-bold mb-2 mt-2"
                  onClick={() => clickAddProduct()}
                >
                  PUBLISH <CIcon icon={cilCloudUpload} size="lg" />
                </CButton>
                <CButton
                  color="primary"
                  type="submit"
                  className="fw-bold mb-2 mt-2"
                  onClick={Cancel}
                >
                  CANCEL <CIcon icon={cilPencil} size="lg" />
                </CButton>
              </CCol>
            </CCardHeader>
          )}

          <CCardBody>
            <CForm>
              <CRow>
                <CCol sm={6}>
                  <CCard className="mt-2 " sm={12}>
                    <CCardBody className="d-flex align-items-center gap-3">
                      <img
                        src="../../../demo_image/demo_avatar.png"
                        alt="ảnh đại diện"
                        className="user-image"
                      />
                      <div>
                        <CCardTitle className="fw-bold">
                          Thợ : <span className="fw-normal">Nguyễn Duy Tân</span>
                        </CCardTitle>
                        <CCardText className="fw-bold">
                          Sđt : <span className="fw-normal">0969884721</span>
                          <br />
                          Email :&nbsp;
                          <span className="fw-normal">nguyenduytan.08052003@gmail.com</span>
                          <br />
                          Trạng thái :&nbsp;
                          <span className="fs-4 fw-normal">
                            <CBadge color="success">Đang rảnh</CBadge>
                          </span>
                        </CCardText>
                      </div>
                    </CCardBody>
                  </CCard>
                </CCol>

                <CRow className="mt-2 mb-2 g-3 ">
                  <CCol sm={6} xl={4} xxl={3}>
                    <CBadge
                      color="primary"
                      className="d-flex justify-content-center gap-3 align-items-center fs-5"
                      style={{ height: '100px' }}
                    >
                      <span>Tổng số đơn</span>
                      <span>1</span>
                    </CBadge>
                  </CCol>
                  <CCol sm={6} xl={4} xxl={3}>
                    <CBadge
                      color="danger"
                      className="d-flex justify-content-center gap-3 align-items-center fs-5"
                      style={{ height: '100px' }}
                    >
                      <span>Chưa xử lý</span>
                      <span>0</span>
                    </CBadge>
                  </CCol>

                  <CCol sm={6} xl={4} xxl={3}>
                    <CBadge
                      color="warning"
                      className="d-flex justify-content-center gap-3 align-items-center fs-5"
                      style={{ height: '100px' }}
                    >
                      <span>Đang chờ thợ</span>
                      <span>0</span>
                    </CBadge>
                  </CCol>

                  <CCol sm={6} xl={4} xxl={3}>
                    <CBadge
                      color="success"
                      className="d-flex justify-content-center gap-3 align-items-center fs-5"
                      style={{ height: '100px' }}
                    >
                      <span>Đã hoàn thành</span>
                      <span>0</span>
                    </CBadge>
                  </CCol>
                </CRow>

                {/* <CCol sm={12}>
                  <CRow>
                    <CCol sm={12}>
                      <CCard className="mt-2 " sm={12}>
                        <CCardHeader className="fw-bold fs-5">
                          Mã đơn :&nbsp;
                          <span className="fw-normal">abcdasldkjfasdlfkj</span>
                        </CCardHeader>
                        <CListGroup flush>
                          <CListGroupItem className="d-flex align-items-center justify-content-md-start">
                            <img
                              src="../../../demo_image/image.png"
                              alt="ảnh sản phẩm"
                              className=" product-image"
                            />
                            <img
                              src="../../../demo_image/image.png"
                              alt="ảnh sản phẩm"
                              className=" product-image"
                            />
                          </CListGroupItem>

                          <CListGroupItem>
                            <CCardTitle className="fw-bold">Tình trạng thiết bị : </CCardTitle>
                            <CCardText>- Sọc màn hình</CCardText>
                            <CCardText>- Sọc màn hình</CCardText>
                          </CListGroupItem>

                          <CListGroupItem>
                            <CCardTitle className="fw-bold">
                              Tạm tính : <span className="fw-normal">{formatVND(1000000)}</span>
                            </CCardTitle>
                          </CListGroupItem>

                          <CListGroupItem>
                            <CCardTitle className="fw-bold">
                              Địa chỉ gửi hàng :&nbsp;
                              <span className="fw-normal">
                                8/5/18, vườn lài,An phú đông ,quận 12
                              </span>
                            </CCardTitle>
                          </CListGroupItem>

                          <CListGroupItem className="fs-4">
                            <CBadge color="danger">Chưa xử lý</CBadge>
                            <CBadge color="warning">Đang chờ thợ</CBadge>
                            <CBadge color="success">Đã hoàn thành</CBadge>
                          </CListGroupItem>
                        </CListGroup>
                      </CCard>
                    </CCol>
                  </CRow>
                </CCol> */}
              </CRow>
            </CForm>
          </CCardBody>
        </CModalBody>
      </CModal>
    </>
  )
}
export default FormUpdateUser_tho
