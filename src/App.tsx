
import { Route, Routes } from 'react-router-dom'
import './App.css'
import { HomePage } from './features/home/pages/HomePage'
import { CollegeDashboardLayout } from './layouts/CollegeDashboardLayout'
import { Overview } from './features/college/pages/college-dashboard/Overview'
import { Events } from './features/college/pages/college-dashboard/Events'
import { Students } from './features/college/pages/college-dashboard/Students'
import { AuthLayout } from './layouts/AuthLayout'
import { SignIn } from './features/auth/pages/SignIn'
import { SignUp } from './features/auth/pages/SignUp'
import { EventDetailsPage } from './features/events/pages/EventDetailsPage'
import { Clubs } from './features/college/pages/college-dashboard/Clubs'
import { ClubDetailsPage } from './features/clubs/pages/ClubDetailsPage'
import { Inbox } from './features/college/pages/college-dashboard/Inbox'
import { Toaster } from 'sonner'
import { Club } from 'lucide-react'
import { ClubDashboardLayout } from './layouts/ClubDashboardLayout'
import { ClubOverview } from './features/clubs/pages/club-dashboard/ClubOverview'
import { ClubEvents } from './features/clubs/pages/club-dashboard/ClubEvents'



function App() {

  return (
    <>
     <Toaster richColors position="top-right" />
      <Routes>

      <Route path="/" element={<HomePage />} />

      {/* Dashboard wrapper layout */}
      <Route path="/college-dashboard" element={<CollegeDashboardLayout />}>
        {/* Nested pages */}
        <Route index element={<Overview />} />
        <Route path="overview" element={<Overview />} />
        <Route path="inbox" element={<Inbox />} />
        <Route path="events" element={<Events />} />
        <Route path="events/:id" element={<EventDetailsPage />} />
        <Route path="clubs" element={<Clubs />} />
        <Route path="clubs/:id" element={<ClubDetailsPage />} />
        <Route path="students" element={<Students />} />
        {/* <Route path="settings" element={<Settings />} /> */}
      </Route>

      <Route path="/club-dashboard" element={<ClubDashboardLayout />}>
        <Route index element={<ClubOverview />} />
        <Route path="overview" element={<ClubOverview />} />
        <Route path="events" element={<ClubEvents />} />
      </Route>

      <Route path="/auth" element={<AuthLayout />}>
        <Route index element={<SignIn />} />
        <Route path="sign-in" element={<SignIn />} />
        <Route path="sign-up" element={<SignUp />} />
      </Route>



    </Routes>
    </>
  )
}

export default App