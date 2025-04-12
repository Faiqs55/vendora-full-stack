"use client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PrimarySpinner from "./PrimarySpinner";
import adminAuthService from "@/AdminServices/AdminAuthService";
import { loginAdmin } from "@/store/adminUserSlice";

const AdminAuthProtect = ({ children }) => {
  const user = useSelector((state) => state.adminUser);

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const getUser = async () => {
    let gotUser = await adminAuthService.getCurrentUser();
    
    if (gotUser && !gotUser.error) {
      dispatch(loginAdmin(gotUser));
    } else {
      router.push("/admin/login");
    }
  };

  useEffect(() => {
    if (!user.isLoggedIn) {
      getUser();
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <PrimarySpinner />;
  }

  return <div>{children}</div>;
};

export default AdminAuthProtect;
