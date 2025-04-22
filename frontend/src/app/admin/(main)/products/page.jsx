"use client";
import productServices from "@/AdminServices/ProductsServices";
import AdminProductCard from "@/Components/AdminProductCard";
import Pagination from "@/Components/Pagination";
import PrimarySpinner from "@/Components/PrimarySpinner";
import usePagination from "@/hooks/usePagination";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const page = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.adminUser);
  const [page, totalPages, setPage, setTotalPages] = usePagination();

  useEffect(() => {
    setLoading(true);
    const getProducts = async () => {
      const res = await productServices.getAllProducts(page, 8);
      console.log(res);
      
      if (!res) return;
      if (!res.error) {
        setProducts(res.products);
        setTotalPages(res.totalPages);
      } else {
        console.log("no products found");
      }
      setLoading(false);
    };
    if (user.isLoggedIn) {
      getProducts();
    }
  }, [page]);

  if (loading) {
    return <PrimarySpinner />;
  }

  return (
    <div className="p-5">
      <div className="">
        <Link
          className="bg-gray-700 text-white px-3 py-1 rounded-md"
          href={"/admin/products/add"}
        >
          Add New Product
        </Link>
      </div>

      <div className=" my-5 p-5 flex justify-evenly flex-wrap gap-5">
        {products.map((product) => {
          return <AdminProductCard product={product} key={product._id} />;
        })}
      </div>
      <Pagination page={page} totalPages={totalPages} setPage={setPage}/>
    </div>
  );
};

export default page;
