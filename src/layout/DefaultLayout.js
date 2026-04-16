import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'

const DefaultLayout = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem('auth'))
    if (!auth) {
      navigate('/login')
    }
  }, [navigate])

  const auth = JSON.parse(localStorage.getItem('auth'))

  if (!auth) {
    // render rỗng khi chưa login
    return null
  }

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <AppContent />
        </div>
        {/* <AppFooter /> */}
      </div>
    </div>
  )
}

export default DefaultLayout
