import React, { useEffect, useState, useRef } from 'react'
import { getStyle } from '@coreui/utils'
import { CChart } from '@coreui/react-chartjs'
import axios from 'axios'
import { callApiWithToken } from '../../services/api.js'

const api_orders = import.meta.env.VITE_API_SHOW_ORDERS

const auth = JSON.parse(localStorage.getItem('auth'))

const Revenue = () => {
  const chartRef = useRef(null)
  const [chartData, setChartData] = useState({
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    datasets: [
      {
        label: 'Revenue',
        backgroundColor: '#f87979',
        borderColor: '#f87979',
        data: Array(12).fill(0), // mặc định 12 tháng = 0
      },
    ],
  })

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await callApiWithToken(api_orders, auth.token)
        const orders = res.orders
        console.log(orders)
        // Tính tổng doanh thu theo tháng
        const revenuePerMonth = Array(12).fill(0)
        orders.forEach((order) => {
          const month = new Date(order.createdAt).getMonth() // 0-11
          const total = parseFloat(order.total) || 0 // đảm bảo là số
          revenuePerMonth[month] += total
        })

        setChartData((prev) => ({
          ...prev,
          datasets: [{ ...prev.datasets[0], data: revenuePerMonth }],
        }))
      } catch (error) {
        console.error(error)
      }
    }

    fetchOrders()
  }, [])

  const options = {
    plugins: {
      legend: {
        labels: { color: getStyle('--cui-body-color') },
      },
    },
    scales: {
      x: {
        grid: { color: getStyle('--cui-border-color-translucent') },
        ticks: { color: getStyle('--cui-body-color') },
      },
      y: {
        grid: { color: getStyle('--cui-border-color-translucent') },
        ticks: { color: getStyle('--cui-body-color') },
        beginAtZero: true,
      },
    },
  }

  return <CChart type="bar" data={chartData} options={options} ref={chartRef} />
}

export default Revenue
