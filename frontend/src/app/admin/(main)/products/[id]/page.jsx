"use client";

import productServices from "@/AdminServices/ProductsServices";
import PrimarySpinner from "@/Components/PrimarySpinner";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const page = () => {
  const [product, setProduct] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

console.log(product);

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

  if (loading) {
    return <PrimarySpinner />;
  }

  return <div>
    <div className="flex flex-col items-center gap-5">
        <img className="w-[500px] shadow" src={product.featureImage} alt="" />
        <div className="flex gap-3">
            {product.images.map(img => {
                return <img key={img} src={img} alt="" className="w-[200px] h-[200px] shadow" />
            })}
        </div>
    </div>

    <div>
        <h1>Product Name: {product.productName}</h1>
        <p>{product.desc}</p>

    </div>

  </div>;
};

export default page;
