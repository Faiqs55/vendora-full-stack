import React from 'react'

const ErrorAlert = ({e}) => {
  return (
    <div className='px-5 py-2 fixed top-15 right-5 rounded-md bg-red-600 text-white text-lg'>
      <div className="absolute z-[-1] h-full rounded-md top-0 left-0 bg-red-400 animate-fill"></div>
        <span className='z-10'>{e}</span>
    </div>
  )
}

export default ErrorAlert