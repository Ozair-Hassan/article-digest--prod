import Hero from './components/Hero'
import Demo from './components/Demo'
import Footer from './components/Footer'
import React, { useEffect } from 'react'

import './App.css'

const App = () => {
  useEffect(() => {
    const handleScroll = () => {
      document.body.classList.add('scrolling')

      // Remove 'scrolling' class after 1 second of no scrolling
      clearTimeout(document.body.scrollTimeout)
      document.body.scrollTimeout = setTimeout(() => {
        document.body.classList.remove('scrolling')
      }, 1000)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(document.body.scrollTimeout)
    }
  }, [])
  return (
    <main>
      <div className="main">
        <div className="gradient" />
      </div>

      <div className="app">
        <Hero />
        <Demo />
        <Footer />
      </div>
    </main>
  )
}

export default App
