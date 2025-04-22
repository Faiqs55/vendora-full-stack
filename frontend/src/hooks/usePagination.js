const { useState, useEffect } = require("react")

const usePagination = () => {
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    return [page, totalPages, setPage, setTotalPages];
}

export default usePagination;