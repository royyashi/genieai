import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import { Route, Routes, useLocation } from 'react-router-dom'
import ChatBox from './components/ChatBox'
import Community from './pages/Community'
import { assets } from './assets/assets'
import { useAppContext } from './context/AppContext'
import './assets/prism.css'
import Loading from './pages/Loading'
import Login from './pages/Login'
import {Toaster} from 'react-hot-toast'


const App = () => {

  const {user, loadingUser, theme}=useAppContext()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const {pathname} = useLocation()

  if(pathname === '/loading' || loadingUser) return <Loading />


  return (
    <>

      <Toaster />
      {!isMenuOpen && (
        <img
          src={assets.menu_icon}
          className='absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden z-50 not-dark:invert'
          onClick={() => setIsMenuOpen(true)}
        />
      )}

      {user ? (<div className={`${theme} bg-white dark:bg-gradient-to-b from-[#242124] to-[#000000] text-black dark:text-white`}>

      <div className='w-full h-screen flex overflow-hidden'>

          {/* Sidebar */}
          <div
            className={`
              ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
              md:translate-x-0
              fixed md:relative
              z-50
              w-72
              h-full
              transition-transform duration-300
              shrink-0
            `}
          >
            <Sidebar
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
            />
          </div>

          {/* Main Content */}
          <div className='flex-1 w-full min-w-0 h-full'>
              <Routes>
                  <Route path='/' element={<ChatBox />} />
                  <Route path='/community' element={<Community />} />
              </Routes>
          </div>

      </div>
    </div>) : (
      <div className='bg-gradient-to-b from-[#242124] to-[#000000] flex items-center justify-center h-screen w-screen'>
        <Login />
      </div>
    )}

      
      
    </>
  )
}
export default App