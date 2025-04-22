"use client";
import React, { useRef, useState } from "react";
import { MdDelete } from "react-icons/md";
import { IoIosCloudUpload } from "react-icons/io";
import ErrorAlert from "@/Components/ErrorAlert";
import productServices from "@/AdminServices/ProductsServices";

const page = () => {
  const imgRef = useRef();
  const [validationError, setValidationError] = useState(null);
  const [variation, setVariation] = useState([{ name: "", values: "" }]);
  const [images, setImages] = useState([]);
  const [featureImg, setFeatureImg] = useState(null);
  const [inputData, setInputData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
    setFeatureImg(files[0]);
  };

  const removeImageHandler = (index) => {
    setImages((prev) => prev.filter((img, idx) => idx !== index));
  };

  const addMoreVariationHandler = () => {
    setVariation((prev) => {
      return [...prev, { name: "", values: "" }];
    });
  };

  const removeVariationHandler = (index) => {
    setVariation((prev) => {
      return prev.slice(index - 1, index);
    });
  };

  const variationChangeHandler = (e, index) => {
    const { name, value } = e.target;
    const updated = [...variation];
    if (name === "values") {
      const valArray = value.split(",").map((s) => s.trim());
      updated[index][name] = valArray;
    } else {
      updated[index][name] = value;
    }
    setVariation(updated);
  };

  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setInputData((prev) => {
      return {
        ...prev,
        [name]: value,
        variations: variation,
        images,
        featureImage: featureImg,
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
      }, 5000)
    }
    if (!inputData?.productName) {
      setValidationError("Please Enter a Product Name");
      setLoading(false)
      errorTimer();
      return;
    }
    if (!inputData?.desc) {
      setValidationError("Please Enter a Product Description");
      setLoading(false)
      errorTimer();
      return;
    }
    if (!inputData?.category) {
      setValidationError("Please Enter a Product Category");
      setLoading(false)
      errorTimer();
      return;
    }

    if (variation[0]?.name === "" || variation[0]?.values.length < 1) {
      setValidationError(
        "Please Provide Valid Variations or Remove the Empty Variation"
      );
      setLoading(false)
      errorTimer();
      return;
    }

    if (!inputData?.price) {
      setValidationError("Please Enter a Product Price");
      setLoading(false)
      errorTimer();
      return;
    }
    if (!images || images.length < 1) {
      setValidationError("Please Provide Product Images");
      setLoading(false)
      errorTimer();
      return;
    }
    if (!featureImg) {
      setValidationError("Please Provide a Feature Images");
      errorTimer();
      return;
    }
    if (!inputData.stock) {
      setValidationError("Please Enter a The Amount of stock you have");
      setLoading(false)
      errorTimer();
      return;
    }

    setValidationError(null);

    const urls = [];
    let featureImage;
    for (let img of images) {
      const formData = new FormData();
      formData.append("file", img);
      formData.append("upload_preset", "vendora_unsigned");
      try {
        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dhdgrfseu/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await res.json();
        if (img === featureImg) {
          featureImage = data.secure_url;
        } else {
          urls.push(data.secure_url);
        }
      } catch (error) {
        console.error("Upload Failed", error);
      }
    }
    const finalData = {
      ...inputData,
      featureImage,
      images: urls,
    };

    const res = await productServices.addProduct(finalData);
    console.log(res);
    setLoading(false)
  };
  

  return (
    <div className="p-5 flex flex-col gap-5">
      {validationError && <ErrorAlert e={validationError} />}
      <h2 className="text-2xl font-semibold text-center">Add a new Product</h2>

      <form onSubmit={submitHandler} action="" className="flex flex-col gap-7">
        <div className="flex flex-col gap-1">
          <label htmlFor="" className="text-md font-semibold">
            Name your product:
          </label>
          <input
            name="productName"
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
            className="border-gray-500 border-2 outline-none px-2 py-1 rounded-md"
            type="text"
            placeholder="What is the Category of your product?"
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <h2 className="text-md font-semibold">Add Variations:</h2>
          {variation.map((count, index) => {
            return (
              <div key={index} className="w-full flex gap-2">
                <input
                  name="name"
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
            onChange={inputChangeHandler}
            className="border-gray-500 border-2 outline-none px-2 py-1 rounded-md"
            type="number"
            placeholder="Price of your product"
          />
        </div>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => imgRef.current.click()}
            type="button"
            className="flex items-center mt-3 cursor-pointer bg-gray-700 text-white py-2 justify-center rounded-md gap-3"
          >
            <IoIosCloudUpload className="text-2xl" />
            <span className="font-semibold">Click To Add Images</span>
          </button>
          <input
            ref={imgRef}
            name="images"
            multiple
            accept="image/*"
            onChange={handleImagesChange}
            className="border-gray-500 border-2 outline-none px-2 py-1 rounded-md hidden"
            type="file"
            placeholder="images"
          />
          <div className="flex gap-5 mt-2">
            {images.map((img, idx) => {
              return (
                <div
                  onClick={() => {
                    setFeatureImg(img);
                  }}
                  key={idx}
                  className={`relative w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded  ${
                    featureImg === img ? "border-2" : ""
                  }`}
                >
                  <img
                    src={URL.createObjectURL(img)}
                    alt="preview"
                    className="object-cover rounded w-full h-full"
                  />
                  <div className="bg-[#ffffff6e] w-full h-full absolute top-0 left-0 flex justify-center items-center">
                    {featureImg === img && (
                      <span className="text-md font-semibold">
                        Feature Image
                      </span>
                    )}
                  </div>
                  <MdDelete
                    color="white"
                    onClick={() => {
                      removeImageHandler(idx);
                    }}
                    className="absolute z-10 top-1 right-1 bg-gray-700 p-2 rounded-md text-4xl"
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="" className="text-md font-semibold">
            Enter Stock Value:
          </label>
          <input
            name="stock"
            onChange={inputChangeHandler}
            className="border-gray-500 border-2 outline-none px-2 py-1 rounded-md"
            type="number"
            placeholder="Enter stock value"
          />
        </div>
        <button disabled={loading} className={`outline-none flex gap-2 items-center ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-gray-700 cursor-pointer"}  text-white rounded-md self-start  py-1.5 px-3`}>
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
