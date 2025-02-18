import { Pagination } from 'react-bootstrap';

function PaginationComponent({ currentPage, totalPages, itemsPerPage, onPageChange, onItemsPerPageChange }) {
    return (
        <div>
            <label>
                Show:
                <select value={itemsPerPage} onChange={(e) => onItemsPerPageChange(Number(e.target.value))}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                </select> items per page
            </label>

            <Pagination className='mt-3'>
                <Pagination.First onClick={() => onPageChange(1)} disabled={currentPage === 1} />
                <Pagination.Prev onClick={() => onPageChange(Math.max(currentPage - 1, 1))} disabled={currentPage === 1} />

                <Pagination.Item active={currentPage === 1} onClick={() => onPageChange(1)}>1</Pagination.Item>
                {currentPage > 3 && <Pagination.Ellipsis disabled />}

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((n) => n === 1 || n === totalPages || (n >= currentPage - 1 && n <= currentPage + 1))
                    .map((number) => (
                        number !== 1 && number !== totalPages ? (
                            <Pagination.Item key={number} active={number === currentPage} onClick={() => onPageChange(number)}>
                                {number}
                            </Pagination.Item>
                        ) : null
                    ))}

                {currentPage < totalPages - 2 && <Pagination.Ellipsis disabled />}
                {totalPages > 1 && currentPage !== totalPages && (
                    <Pagination.Item active={currentPage === totalPages} onClick={() => onPageChange(totalPages)}>
                        {totalPages}
                    </Pagination.Item>
                )}

                <Pagination.Next onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))} disabled={currentPage === totalPages} />
                <Pagination.Last onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} />
            </Pagination>
        </div>
    );
};

export default PaginationComponent;
