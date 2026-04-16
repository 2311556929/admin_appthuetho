import WidgetsDropdown from './WidgetsDropdown'
import MainChart from './MainChart'
import Revenue from './Revenue'

const Dashboard = () => {
  return (
    <>
      <WidgetsDropdown className="mb-4" />
      <MainChart />
      <Revenue />
    </>
  )
}

export default Dashboard
