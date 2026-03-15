
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
import { AdminEventDetailsPage } from './features/events/pages/AdminEventDetailsPage'
import { Clubs } from './features/college/pages/college-dashboard/Clubs'
import { ClubDetailsPage } from './features/clubs/pages/ClubDetailsPage'
import { Inbox } from './features/college/pages/college-dashboard/Inbox'
import { Toaster } from 'sonner'
// import { Club, Scroll } from 'lucide-react'
import { ClubDashboardLayout } from './layouts/ClubDashboardLayout'
import { ClubOverview } from './features/clubs/pages/club-dashboard/ClubOverview'
import { ClubEvents } from './features/clubs/pages/club-dashboard/ClubEvents'
import { ClubInbox } from './features/clubs/pages/club-dashboard/ClubInbox'
import { ExploreEventsPage } from './features/home/pages/ExploreEventsPage'
import ScrollToTop from './components/ui/ScrollToTop'
import { DefaultLayout } from './layouts/DefaultLayout'
import { PublicEventDetailsPage } from './features/events/pages/PublicEventDetailsPage'
import { EventAttendancePage } from './features/events/pages/EventAttendancePage'
import { EventRegistrationsPage } from './features/events/pages/EventRegistrationsPage'
import { Staff } from './features/college/pages/college-dashboard/Staff'
// import { De } from 'zod/v4/locales'



function App() {

  return (
  <>
    <Toaster richColors position="top-right" />
    <ScrollToTop />

    <Routes>

      {/* ================= PUBLIC SITE ================= */}
      <Route element={<DefaultLayout />}>
        <Route index element={<HomePage />} />
        <Route path="explore-events" element={<ExploreEventsPage />} />
        <Route path="explore-events/events/:id" element={<PublicEventDetailsPage />} />
      </Route>

      {/* ================= COLLEGE DASHBOARD ================= */}
      <Route path="college-dashboard" element={<CollegeDashboardLayout />}>
        <Route index element={<Overview />} />
        <Route path="overview" element={<Overview />} />
        <Route path="inbox" element={<Inbox />} />
        <Route path="events" element={<Events />} />
        <Route path="staff" element={<Staff/>} />
        <Route path="events/:id" element={<AdminEventDetailsPage />} />
        <Route path="events/:id/registrations" element={<EventRegistrationsPage />} />
        <Route path="events/:id/attendance" element={<EventAttendancePage />} />
        <Route path="clubs" element={<Clubs />} />
        <Route path="clubs/:clubId" element={<ClubDetailsPage />} />
        <Route path="students" element={<Students />} />
      </Route>

      {/* ================= CLUB DASHBOARD ================= */}
      <Route path="club-dashboard" element={<ClubDashboardLayout />}>
        <Route index element={<ClubOverview />} />
        <Route path="overview" element={<ClubOverview />} />
        <Route path="events" element={<ClubEvents />} />
        <Route path="inbox" element={<ClubInbox />} />
      </Route>

      {/* ================= AUTH ================= */}
      <Route path="auth" element={<AuthLayout />}>
        <Route index element={<SignIn />} />
        <Route path="sign-in" element={<SignIn />} />
        <Route path="sign-up" element={<SignUp />} />
      </Route>

    </Routes>
  </>
)

}

export default App