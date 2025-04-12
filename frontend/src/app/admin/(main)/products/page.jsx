import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div className='p-5'>
        <div className=''>
          <Link className='bg-gray-700 text-white px-3 py-1 rounded-md' href={"/admin/products/add"}>Add New Product</Link>
        </div>
    </div>
  )
}

export default page