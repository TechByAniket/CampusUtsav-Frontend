
import { Route, Routes } from 'react-router-dom'
import './App.css'
import { HomePage } from './features/home/pages/HomePage'
import { CollegeDashboardLayout } from './layouts/CollegeDashboardLayout'
import { Overview } from './features/college/pages/college-dashboard/Overview'
import { Events } from './features/college/pages/college-dashboard/Events'
import { Students } from './features/college/pages/college-dashboard/Students'

function App() {

  return (
    <>
      <Routes>

      <Route path="/" element={<HomePage />} />

      {/* Dashboard wrapper layout */}
      <Route path="/college-dashboard" element={<CollegeDashboardLayout />}>
        {/* Nested pages */}
        <Route index element={<Overview />} />
        <Route path="overview" element={<Overview />} />
        <Route path="events" element={<Events />} />
        <Route path="students" element={<Students />} />
        {/* <Route path="settings" element={<Settings />} /> */}
      </Route>

    </Routes>
    </>
  )
}

export default App