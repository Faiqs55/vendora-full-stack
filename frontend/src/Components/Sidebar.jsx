"use client";
import { logoutAdmin } from "@/store/adminUserSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const Sidebar = () => {
  const user = useSelector(state => state.adminUser);  
  const dispatch = useDispatch();
  const router = useRouter();

  const logoutHandler = () => {
    localStorage.removeItem("AdminToken")
    dispatch(logoutAdmin());
    router.push("/admin/login")
  }

  const links = [
    {
      text: "Vendors",
      link: "/admin/vendors",
      visibleTo: ["admin"],
      id: 1,
    },
    {
      text: "Products",
      link: "/admin/products",
      visibleTo: ["admin"],
      id: 2,
    },
    {
      text: "Customers",
      link: "/admin/vendors",
      visibleTo: ["admin"],
      id: 3,
    },
    {
      text: "My Products",
      link: "/admin/products",
      visibleTo: ["vendor"],
      id: 4,
    },
    {
      text: "Orders",
      link: "/admin/vendors",
      visibleTo: ["admin"],
      id: 5,
    },
    {
      text: "My Orders",
      link: "/admin/vendors",
      visibleTo: ["vendor"],
      id: 6,
    },
  ];

  return (
    <div className="w-[20%] flex flex-col justify-between py-5 px-2 min-h-[100vh] bg-gray-100">
      <div className="flex flex-col gap-5">
        {links.map((link) => {
          if (link.visibleTo.includes(user?.user?.role)) {
            return (
              <Link
                className="bg-gray-300 rounded-md hover:bg-gray-400 duration-300 px-5 py-2"
                key={link.id}
                href={link.link}
              >
                {link.text}
              </Link>
            );
          }
        })}
      </div>
      <button onClick={logoutHandler} className="bg-gray-700 text-white py-1.5 rounded-md cursor-pointer">
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
