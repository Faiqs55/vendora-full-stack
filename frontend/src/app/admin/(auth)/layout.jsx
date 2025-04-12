"use client";
import PrimarySpinner from '@/Components/PrimarySpinner';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import adminAuthService from '@/AdminServices/AdminAuthService';
import { loginAdmin } from '@/store/adminUserSlice';

const layout = ({children}) => {
    const user = useSelector(state => state.adminUser);
    console.log(user);
    
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    const getUser = async () => {
      let gotUser = await adminAuthService.getCurrentUser();      
      if (gotUser && !gotUser.error) {
        dispatch(loginAdmin(gotUser));
      } else {
        setLoading(false);
      }
    };
    
    
    useEffect(() => {
        if(user.isLoggedIn){
            router.push("/admin");
        }else{
            getUser();
        }
    }, [user])

    if(loading) return <PrimarySpinner/>
  return (
    <div>{children}</div>
  )
}

export default layout