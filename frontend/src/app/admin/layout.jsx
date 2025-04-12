"use client";
import store from '@/store/store'
import React, { useEffect } from 'react'
import { Provider } from 'react-redux'

const layout = ({children}) => {


  
  return (
    <Provider store={store}>
        {children}
    </Provider>
  )
}

export default layout