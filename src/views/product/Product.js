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
import { callApiByLimit } from '../../services/api'
import FormUpdareProduct from './FormUpdateProduct.js'

const api_show_products_by_limit = import.meta.env.VITE_API_SHOW_PRODUCTS_LIMIT
const api_delete_products = import.meta.env.VITE_API_DELETE_PRODUCT
const host_name = import.meta.env.VITE_HOST_NAME_UPLOADS

const Product = () => {
  const [allProducts, setAllProducts] = useState([]) // State to hold all products data
  const [update, setUpdate] = useState(false)
  const [page, setPage] = useState(1) // trang hiện tại
  const [limit] = useState(10) // số sản phẩm mỗi trang
  const [totalPages, setTotalPages] = useState(1)

  const fetchResetApi = async () => {
    const result = await callApiByLimit(api_show_products_by_limit, page, limit) //res.data để nhận dữ liệu từ be gửi lên
    setAllProducts(result.products) // mảng sản phẩm be gửi lên
    setTotalPages(result.totalPages) //totalPages từ be gửi lên fe
  }

  useEffect(() => {
    const fetchApi = async () => {
      const result = await callApiByLimit(api_show_products_by_limit, page, limit) //res.data để nhận dữ liệu từ be gửi lên
      setAllProducts(result.products) // mảng sản phẩm be gửi lên
      setTotalPages(result.totalPages) //totalPages từ be gửi lên fe
    }
    fetchApi(page, limit)
  }, [page, limit])

  const formatVND = (amount) => {
    amount = Number(amount)
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
  }

  // show detail product
  const clickShowDetailProduct = () => {
    setUpdate({ update: true, edit: false })
  }

  // edit product
  const clickEditProductById = () => {
    setUpdate({ update: true, edit: true })
  }

  // delete product
  const clickDeleteProductById = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) return

    try {
      await axios.delete(`${api_delete_products}${id}`)
      setAllProducts((prev) => prev.filter((p) => p.id !== id))
      alert('Xóa sản phẩm thành công!')
    } catch (err) {
      console.error('Lỗi khi xóa sản phẩm:', err)
      alert('Xóa sản phẩm thất bại!')
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
                <CTableHeaderCell scope="col">Hình ảnh thiết bị</CTableHeaderCell>
                <CTableHeaderCell scope="col">khách hàng</CTableHeaderCell>
                <CTableHeaderCell scope="col">Thợ</CTableHeaderCell>
                <CTableHeaderCell scope="col">Loại dịch vụ</CTableHeaderCell>
                <CTableHeaderCell scope="col">Tạm tính</CTableHeaderCell>
                <CTableHeaderCell scope="col">Trạng thái</CTableHeaderCell>
                <CTableHeaderCell scope="col">Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            {/* ------------------------------DEMO chờ API------------------------------------------------------------- */}
            <CTableBody className="fs-5">
              <CTableRow>
                <CTableHeaderCell>
                  <img
                    src="../../../demo_image/image.png"
                    alt="ảnh sản phẩm"
                    className="mb-2 product-image"
                  />
                  <br />
                  <img
                    src="../../../demo_image/image.png"
                    alt="ảnh sản phẩm"
                    className="product-image"
                  />
                  <br />
                </CTableHeaderCell>
                <CTableDataCell>Duy Tân - 0969884721</CTableDataCell>
                <CTableDataCell>Duy Tân - 0969884721</CTableDataCell>
                <CTableDataCell>Sửa ti vi</CTableDataCell>
                <CTableDataCell>{formatVND(1000000)}</CTableDataCell>
                <CTableDataCell className="fs-4">
                  <CBadge color="danger">Chưa xử lý</CBadge>
                  {/* <CBadge color="warning">Đang chờ thợ</CBadge> */}
                  {/* <CBadge color="success">Đã hoàn thành</CBadge> */}
                </CTableDataCell>
                <CTableDataCell>
                  <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                    <CButton color="info" onClick={() => clickShowDetailProduct()}>
                      <CIcon icon={cilFullscreen} />
                    </CButton>
                    <CButton color="primary" onClick={() => clickEditProductById()}>
                      <CIcon icon={cilPencil} />
                    </CButton>
                    <CButton
                      color="danger"
                      onClick={() => clickDeleteProductById(product.idProduct)}
                    >
                      <CIcon icon={cilTrash} />
                    </CButton>
                  </div>
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
            {/* ------------------------------------------------------------------------------------------- */}
            {/* <CTableBody>
              {allProducts.length > 0 ? (
                allProducts.map((product, index) => (
                  <CTableRow key={index}>
                    <CTableHeaderCell scope="row">
                      <img
                        src={`${host_name}${product.thumbnail}`}
                        alt={product.nameProduct}
                        className="product-image"
                      />
                      {product.nameProduct}
                    </CTableHeaderCell>
                    <CTableDataCell>{product?.category?.nameCategory}</CTableDataCell>
                    <CTableDataCell>{product?.brand?.nameBrand}</CTableDataCell>
                    <CTableDataCell>{product?.specs?.quantity}</CTableDataCell>
                    <CTableDataCell>{formatVND(product.originalPrice)}</CTableDataCell>
                    <CTableDataCell>{formatVND(product.price)}</CTableDataCell>
                    <CTableDataCell>
                      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                        <CButton
                          color="info"
                          onClick={() => clickShowDetailProduct(product.idProduct)}
                        >
                          <CIcon icon={cilFullscreen} />
                        </CButton>
                        <CButton color="primary" onClick={() => clickEditProductById(product)}>
                          <CIcon icon={cilPencil} />
                        </CButton>
                        <CButton
                          color="danger"
                          onClick={() => clickDeleteProductById(product.idProduct)}
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
            </CTableBody> */}
          </CTable>
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
      {/* truyền prop cho FormUpdareProduct giá trị onClose và setUpdate(flase) để bên FormUpdareProduct viết sự kiện onClick để thực thi Cancel */}
      {update && (
        <FormUpdareProduct
          visible={update.update}
          product={{ '': '' }}
          Cancel={() => setUpdate(false)}
          fetchResetApi={fetchResetApi}
          edit={update.edit}
        />
      )}
      {/* <FormUpdareProduct
        visible="true"
        product={{ '': '' }}
        Cancel={() => setUpdate(false)}
        fetchResetApi={fetchResetApi}
        edit="false"
      /> */}
    </>
  )
}

export default Product
