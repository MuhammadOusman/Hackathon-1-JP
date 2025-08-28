import React from 'react'
import Home from './Home'
import { Outlet } from 'react-router-dom'

const AuthProtector = () => {
  let userId = localStorage.getItem('uid')
  return !userId ? <Outlet /> : <Home />
}

export default AuthProtector
