import axios from 'axios'

// const api_all_products = import.meta.env.VITE_API_SHOW_PRODUCTS
// const api_show_products_by_limit = import.meta.env.VITE_API_SHOW_PRODUCTS_LIMIT
// const api_all_brands = import.meta.env.VITE_API_SHOW_BRANDS
// const api_all_categories = import.meta.env.VITE_API_SHOW_CATEGORIES
// const api_all_specs = import.meta.env.VITE_API_SHOW_SPECS
// const api_all_status = import.meta.env.VITE_API_SHOW_STATUS
// const api_all_users = import.meta.env.VITE_API_SHOW_USERS
// const api_all_role = import.meta.env.VITE_API_SHOW_ROLE
// const api_show_users_by_limit = import.meta.env.VITE_API_SHOW_USERS_LIMIT
// const api_all_orders = import.meta.env.VITE_API_SHOW_ORDERS
// const api_all_questions = import.meta.env.VITE_API_SHOW_QUESTION

export const callApi = (url) =>
  axios
    .get(`${url}`)
    .then((response) => {
      console.log('API response All data:', response.data)
      return response.data
    })
    .catch((error) => {
      console.error('Error fetching data from API:', error)
      throw error
    })
// call api with token
export const callApiWithToken = (url, token) =>
  axios
    .get(`${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      console.log('API response All data:', response.data)
      return response.data
    })
    .catch((error) => {
      console.error('Error fetching data from API:', error)
      throw error
    })

export const callApiByLimit = (url, page, limit) =>
  axios
    .get(`${url}?page=${page}&limit=${limit}`)
    .then((response) => {
      console.log('API response All data:', response.data)
      return response.data
    })
    .catch((error) => {
      console.error('Error fetching data from API:', error)
      throw error
    })
