"use client";

import productServices from "@/AdminServices/ProductsServices";
import ErrorAlert from "@/Components/ErrorAlert";
import PrimarySpinner from "@/Components/PrimarySpinner";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const page = () => {
  const [product, setProduct] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = useParams();
  useEffect(() => {
    const getProductData = async () => {
      const res = await productServices.getSingleProduct(id);
      if (!res.error) {
        setProduct(res);
      } else {
        setErr(res.error);
      }
      setLoading(false);
    };

    getProductData();
  }, []);

  const deleteClickHandler = async () => {
    setLoading(true);
    const res = await productServices.deleteProduct(id);
    if (!res.error) {
      console.log("in");

      router.replace("/admin/products");
    } else {
      setErr(res.error.msg);
    }
    setLoading(false);
  };

  if (loading) {
    return <PrimarySpinner />;
  }

  if (err) return <ErrorAlert e={err.msg} />;

  return (
    <div>
      <div>
        <button
          onClick={deleteClickHandler}
          className="bg-gray-700 text-white px-3 py-1 rounded-md"
        >
          Delete Product
        </button>
        <Link href={`/admin/products/update/${id}`} className="bg-gray-700 text-white px-3 py-1 rounded-md">Update Product</Link>
      </div>
      <div className="flex items-center gap-5">
        <img className="w-[50%] shadow" src={product.featureImage} alt="" />
        <div className="flex gap-3 w-[50%] flex-col items-end">
          {product.images.map((img) => {
            return (
              <img
                key={img}
                src={img}
                alt=""
                className="w-[200px] h-[200px] shadow"
              />
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2 p-5">
        <h1 className="font-semibold text-2xl">
          Product Name: {product.productName}
        </h1>
        <h2 className="font-bold text-xl">Price: ${product.price}</h2>
        <p className="text-gray-500">{product.desc}</p>
        {product.variations.map((vari) => (
          <div key={vari.name}>
            <span className="font-bold">{vari.name}</span>
            <div className="flex gap-2">
              {vari.values.map((val) => (
                <span key={val}>{val}</span>
              ))}
            </div>
          </div>
        ))}

        <h2 className="text-xl">Stock: {product.stock}</h2>
      </div>
    </div>
  );
};

export default page;
