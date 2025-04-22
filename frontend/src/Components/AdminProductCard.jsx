import Link from "next/link";
import React from "react";

const AdminProductCard = ({ product }) => {
  return (
    <Link href={`/admin/products/${product._id}`} key={product._id} className="bg-white p-2 rounded-md shadow w-[250px]">
      <img
        className="object-center w-full h-[200px]"
        src={product.featureImage}
        alt=""
      />
      <div className="flex justify-between items-center mt-2">
        <div>
          <h1 title={product.productName} className="font-semibold">
            {product.productName.slice(0, 10)}...
          </h1>
          <h2 className="font-bold text-2xl text-green-600">
            ${product.price}
          </h2>
        </div>
        <div>
          <h3 className="text-xs text-gray-500">{product.category}</h3>
          <h3>
            <span className="text-xs text-gray-500">In Stock:</span>{" "}
            {product.stock}
          </h3>
        </div>
      </div>
      <p className="text-sm text-gray-500">{product.desc.slice(0, 20)}...</p>
    </Link>
  );
};

export default AdminProductCard;
