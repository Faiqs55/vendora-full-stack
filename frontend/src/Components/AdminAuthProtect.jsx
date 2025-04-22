"use client";
import React from "react";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PrimarySpinner from "./PrimarySpinner";
import adminAuthService from "@/AdminServices/AdminAuthService";
import { loginAdmin } from "@/store/adminUserSlice";

const AdminAuthProtect = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkUser = async () => {

      try {
        const gotUser = await adminAuthService.getCurrentUser();
        if (gotUser && !gotUser.error) {
          dispatch(loginAdmin(gotUser));
          setLoading(false);
        } else {
          router.replace("/admin/login");
        }
      } catch (err) {
        router.replace("/admin/login");
      }
    };

    checkUser();
  }, []);

  if (loading) {
    return <PrimarySpinner />;
  }

  return <div>{children}</div>;
};

export default AdminAuthProtect;
