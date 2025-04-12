"use client";
import React, { useState } from "react";
import Link from "next/link";
import adminAuthService from "@/AdminServices/AdminAuthService";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { loginAdmin } from "@/store/adminUserSlice";

const page = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState({});
  const [userData, setUserData] = useState({});
  const router = useRouter();
  const dispatch = useDispatch();
  

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;

    setUserData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const submitHandler = async (e) => {
    setLoading(true);
    e.preventDefault();
    let res = await adminAuthService.loginUser(userData);
    
    if(!res.error){
      dispatch(loginAdmin(res))
      router.push("/admin")
    }
    setResponse(res);
    setLoading(false);
  };


  return (
    <div
      className="h-[100vh] w-full flex items-center justify-center bg-no-repeat bg-center bg-cover"
      style={{ backgroundImage: "url('/dot-bg.jpg')" }}
    >
      <form
        onSubmit={submitHandler}
        action=""
        className="lg:w-[40%] md:w-[60%] w-full mx-2 md:mx-0 bg-white p-10 border-2 border-gray-400 rounded-md flex flex-col gap-5 items-center"
      >
        <h2 className="text-3xl font-semibold">Welcome Back!</h2>
        {response.error && (
          <span className="px-4 py-2 bg-red-600 rounded-md text-white">
            {response?.error?.msg}
          </span>
        )}
        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col w-full">
            <label htmlFor="">Email:</label>
            <input
              onChange={inputChangeHandler}
              name="email"
              className="w-full outline-none border-2 border-gray-200 rounded-sm px-2 py-1 focus:border-gray-500"
              type="text"
              placeholder="Type Here..."
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="">Password:</label>
            <input
              onChange={inputChangeHandler}
              name="password"
              className="w-full outline-none border-2 border-gray-200 rounded-sm px-2 py-1 focus:border-gray-500"
              type="text"
              placeholder="Type Here..."
            />
          </div>
          <button
            disabled={loading}
            className="bg-[#444] flex justify-center gap-2 items-center  disabled:bg-[#888] text-white py-2 rounded-md cursor-pointer mt-2"
          >
            {!loading ? "Let's Go!" : "Submitting..."}
            {loading && (
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-gray-200 animate-spin fill-gray-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            )}
          </button>
        </div>
        <span>
          Want to be a Vendor?{" "}
          <Link className="underline" href={"/admin/register"}>
            Register
          </Link>
        </span>
      </form>
    </div>
  );
};

export default page;
