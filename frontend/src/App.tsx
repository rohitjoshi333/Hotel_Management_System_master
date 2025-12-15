import './App.css'
import './index.css'

import { Route, Routes, useLocation } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { NavBar, Footer, AllRooms, ContactUs, AboutUs, GetStarted, Login, SignUp, RoomDetails, Book, Profile, Gallery, AdminDashboard } from './components'
import ProtectedRoute from './components/ProtectedRoute'
import ScrollToTop from './hooks/ScrollToTop'

function App() {
  const [showLoader, setShowLoader] = useState(false)
  const firstLoad = useRef(true)
  const location = useLocation()

  const noNavFooter = ["/login", "/signup"]
  const showNavFooter = !noNavFooter.includes(location.pathname)

  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false
      return
    }
    setShowLoader(true)
    const timer = setTimeout(() => setShowLoader(false), 1000)
    return () => clearTimeout(timer)
  }, [location.pathname])

  return (
    <>
    <ScrollToTop />

      {showLoader && (
        <div className="page-loader">
          <div className="loader-card">
            <div className="loader-dots">
              <span />
              <span />
              <span />
            </div>
            <p className="loader-text">Loading...</p>
          </div>
        </div>
      )}

      {showNavFooter && <NavBar />}
      <Routes>
        <Route path="/" element={<ProtectedRoute allowAdminOnUserPages={false}><GetStarted /></ProtectedRoute>} />
        <Route
          path="/allRooms"
          element={
            <ProtectedRoute allowAdminOnUserPages={false}>
              <AllRooms />
            </ProtectedRoute>
          }
        />
        <Route path="/contactUs" element={<ProtectedRoute allowAdminOnUserPages={false}><ContactUs /></ProtectedRoute>} />
        <Route path="/aboutUs" element={<ProtectedRoute allowAdminOnUserPages={false}><AboutUs /></ProtectedRoute>} />
        <Route path="/gallery" element={<ProtectedRoute allowAdminOnUserPages={false}><Gallery /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/rooms/:id"
          element={
            <ProtectedRoute allowAdminOnUserPages={false}>
              <RoomDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking/:id"
          element={
            <ProtectedRoute allowAdminOnUserPages={false}>
              <Book />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowAdminOnUserPages={false}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin message="Admin access required.">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      {showNavFooter && <Footer />}
       
    </>
  )
}

export default App
