"use client";
import AdminAuthProtect from "@/Components/AdminAuthProtect";
import Sidebar from "@/Components/Sidebar";

const layout = ({ children }) => {
  
  return (
      <AdminAuthProtect>
        <div className="flex gap-5">
          <Sidebar />
          <div className="w-[80%] min-h-[100vh] flex flex-col gap-2 bg-gray-100">
            <nav className="h-[7vh] flex items-center justify-end px-5 bg-gray-700 text-white">
              <h1 className="text-2xl font-semibold">Vendora Admin</h1>
            </nav>
            <div className="">{children}</div>
          </div>
        </div>
      </AdminAuthProtect>
  );
};

export default layout;
