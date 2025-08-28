import React from 'react'
import { Outlet } from 'react-router-dom';
import Login from './Login';

const HomeProtector = () => {
    let userId = localStorage.getItem('uid');
  return userId ? <Outlet /> : <Login />
}

export default HomeProtector
