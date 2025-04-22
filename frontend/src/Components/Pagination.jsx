import React from "react";

const Pagination = ({ page, totalPages, setPage }) => {
  return (
    <div className="flex justify-center mt-5 space-x-2">
      <button
        onClick={() => setPage((p) => Math.max(p - 1, 1))}
        disabled={page === 1}
        className="px-3 py-1 bg-gray-700 text-white rounded cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Prev
      </button>
      <span>
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
        disabled={page === totalPages}
        className="px-3 py-1 bg-gray-700 text-white rounded cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
