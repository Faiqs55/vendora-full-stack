"use client";
import React, { useEffect, useRef, useState } from "react";
import ErrorAlert from "@/Components/ErrorAlert";
import productServices from "@/AdminServices/ProductsServices";
import { useParams } from "next/navigation";
import PrimarySpinner from "@/Components/PrimarySpinner";

const page = () => {
  const { pId } = useParams();

  const [validationError, setValidationError] = useState(null);
  const [inputData, setInputData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const getData = async () => {
      const res = await productServices.getSingleProduct(pId);
      if (!res.error) {
        setInputData(res);
      }
      setLoading(false);
    };
    getData();
  }, []);

  const addMoreVariationHandler = () => {
    setInputData((prev) => {
      return {
        ...prev,
        variations: [...prev.variations, { name: "", values: [] }],
      };
    });
  };

  const removeVariationHandler = (index) => {
    setInputData((prev) => {
      return {
        ...prev,
        variations: [...prev.variations.slice(index - 1, index)],
      };
    });
  };

  const variationChangeHandler = (e, index) => {
    const { name, value } = e.target;
    const updated = [...inputData.variations];
    if (name === "values") {
      const valArray = value.split(",").map((s) => s.trim());
      updated[index][name] = valArray;
    } else {
      updated[index][name] = value;
    }
    setInputData((prev) => {
      return {
        ...prev,
        variations: updated,
      };
    });
  };

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setInputData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const errorTimer = () => {
      setTimeout(() => {
        setValidationError(null);
      }, 5000);
    };
    if (!inputData?.productName) {
      setValidationError("Please Enter a Product Name");
      setLoading(false);
      errorTimer();
      return;
    }
    if (!inputData?.desc) {
      setValidationError("Please Enter a Product Description");
      setLoading(false);
      errorTimer();
      return;
    }
    if (!inputData?.category) {
      setValidationError("Please Enter a Product Category");
      setLoading(false);
      errorTimer();
      return;
    }

    if (
      inputData.variations[0]?.name === "" ||
      inputData.variations[0]?.values.length < 1
    ) {
      setValidationError(
        "Please Provide Valid Variations or Remove the Empty Variation"
      );
      setLoading(false);
      errorTimer();
      return;
    }

    if (!inputData?.price) {
      setValidationError("Please Enter a Product Price");
      setLoading(false);
      errorTimer();
      return;
    }
    if (!inputData.stock) {
      setValidationError("Please Enter a The Amount of stock you have");
      setLoading(false);
      errorTimer();
      return;
    }

    setValidationError(null);
    const finalData = {
      ...inputData,
    };

    const res = await productServices.updateProduct(pId, finalData);

    if (!res.error) {
      console.log(res);
    } else {
      setValidationError(res.error.msg);
    }
    setLoading(false);
  };

  if (loading) return <PrimarySpinner />;

  return (
    <div className="p-5 flex flex-col gap-5">
      {validationError && <ErrorAlert e={validationError} />}
      <h2 className="text-2xl font-semibold text-center">
        Update product {inputData?.productName}
      </h2>

      <form onSubmit={submitHandler} action="" className="flex flex-col gap-7">
        <div className="flex flex-col gap-1">
          <label htmlFor="" className="text-md font-semibold">
            Name your product:
          </label>
          <input
            name="productName"
            value={inputData?.productName}
            onChange={inputChangeHandler}
            className="border-gray-500 border-2 outline-none px-2 py-1 rounded-md"
            type="text"
            placeholder="Name of your Product"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="" className="text-md font-semibold">
            Add a description:
          </label>
          <textarea
            onChange={inputChangeHandler}
            value={inputData?.desc}
            className="border-gray-500 border-2 min-w-full min-h-[200px] outline-none px-2 py-1 rounded-md"
            name="desc"
            id=""
            placeholder="Description of your product"
          ></textarea>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="" className="text-md font-semibold">
            Enter a category:
          </label>
          <input
            name="category"
            onChange={inputChangeHandler}
            value={inputData?.category}
            className="border-gray-500 border-2 outline-none px-2 py-1 rounded-md"
            type="text"
            placeholder="What is the Category of your product?"
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <h2 className="text-md font-semibold">Add Variations:</h2>
          {inputData?.variations.map((count, index) => {
            return (
              <div key={index} className="w-full flex gap-2">
                <input
                  name="name"
                  value={count?.name}
                  onChange={(e) => variationChangeHandler(e, index)}
                  className="border-gray-500 border-2 flex-1/2 outline-none px-2 py-1 rounded-md"
                  type="text"
                  placeholder="name of Variation"
                />
                <input
                  name="values"
                  onChange={(e) => variationChangeHandler(e, index)}
                  className="border-gray-500 border-2 flex-1/2 outline-none px-2 py-1 rounded-md"
                  type="text"
                  value={count?.values.join(", ")}
                  placeholder="enter variations seperated by commas"
                />
                <button
                  type="button"
                  onClick={() => removeVariationHandler(index)}
                  className="border-2 border-gray-400 font-semibold px-2.5 rounded-md cursor-pointer text-gray-400"
                >
                  -
                </button>
              </div>
            );
          })}
          <button
            type="button"
            onClick={addMoreVariationHandler}
            className="font-semibold bg-gray-700 text-white py-1 rounded-md self-end px-3 cursor-pointer mt-2"
          >
            Add new Variation
          </button>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="" className="text-md font-semibold">
            Enter a Price:
          </label>
          <input
            name="price"
            value={inputData?.price}
            onChange={inputChangeHandler}
            className="border-gray-500 border-2 outline-none px-2 py-1 rounded-md"
            type="number"
            placeholder="Price of your product"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="" className="text-md font-semibold">
            Enter Stock Value:
          </label>
          <input
            name="stock"
            value={inputData?.stock}
            onChange={inputChangeHandler}
            className="border-gray-500 border-2 outline-none px-2 py-1 rounded-md"
            type="number"
            placeholder="Enter stock value"
          />
        </div>
        <button
          disabled={loading}
          className={`outline-none flex gap-2 items-center ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-gray-700 cursor-pointer"
          }  text-white rounded-md self-start  py-1.5 px-3`}
        >
          <span>{loading ? "Submitting" : "Add Product"}</span>
          {loading && (
            <div role="status">
              <svg
                aria-hidden="true"
                className="w-4 h-4 text-gray-200 animate-spin fill-gray-600"
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
      </form>
    </div>
  );
};

export default page;
