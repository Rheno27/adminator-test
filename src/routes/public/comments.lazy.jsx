import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { useQuery, useQueries } from '@tanstack/react-query';
import { Table, Form, InputGroup, Container, Row, Col, Button } from 'react-bootstrap';
import { AppNavbar, Sidebar } from '../../components/navbar';
import { getComments } from '../../services/comments';
import { getPostById } from '../../services/posts';
import PaginationComponent from '../../components/pagination';
import SearchBar from '../../components/SearchBar';

export const Route = createLazyFileRoute('/public/comments')({
  component: CommentsTable,
});

function CommentsTable() {
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate({ to: '/login' });
    }
  }, [navigate]);

  // Fetch comments
  const { data: commentsList = [], isLoading: isCommentsLoading } = useQuery({
    queryKey: ['comments'],
    queryFn: getComments,
  });

  // Fetch post titles based on post_id from comments
  const postQueries = useQueries({
    queries: commentsList.map((comment) => ({
      queryKey: ['post', comment.post_id],
      queryFn: () => getPostById(comment.post_id),
      enabled: !!comment.post_id,
    })),
  });

  // Extract post titles
  const postTitleMap = postQueries.reduce((acc, query, index) => {
    if (query.data) {
      acc[commentsList[index].post_id] = query.data.title; // Simpan berdasarkan post_id
    }
    return acc;
  }, {});

  // Sorting logic
  const sortedComments = [...commentsList].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Filter comments based on search input
  const filteredComments = sortedComments.filter((comment) =>
    comment.id.toString().includes(search) ||
    comment.post_id.toString().includes(search) ||
    comment.name.toLowerCase().includes(search.toLowerCase()) ||
    comment.email.toLowerCase().includes(search.toLowerCase()) ||
    comment.body.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredComments.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentComments = filteredComments.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <Container fluid>
      <Row>
        <Col md={2} className="p-0">
          <Sidebar />
        </Col>
        <Col md={10} className="p-0 px-3">
          <AppNavbar />
          <div className="d-flex justify-content-between align-items-center">
            <h3>Comments List</h3>
            {/* <Button variant="primary">Create Comment</Button> */}
          </div>
          <SearchBar search={search} setSearch={setSearch} />
          <Table striped bordered hover responsive>
            <thead style={{ textAlign: 'center' }}>
              <tr>
                <th onClick={() => setSortConfig((prev) => ({
                  key: 'id',
                  direction: prev.key === 'id' && prev.direction === 'asc' ? 'desc' : 'asc',
                }))}>
                  ID {sortConfig.key === 'id' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th>Post Title</th>
                <th onClick={() => setSortConfig((prev) => ({
                  key: 'name',
                  direction: prev.key === 'name' && prev.direction === 'asc' ? 'desc' : 'asc',
                }))}>
                  Name {sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th onClick={() => setSortConfig((prev) => ({
                  key: 'email',
                  direction: prev.key === 'email' && prev.direction === 'asc' ? 'desc' : 'asc',
                }))}>
                  Email {sortConfig.key === 'email' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th>Comment</th>
              </tr>
            </thead>
            <tbody>
              {currentComments.map((comment) => (
                <tr key={comment.id}>
                  <td>{comment.id}</td>
                  <td>{postTitleMap[comment.post_id] || 'Loading...'}</td>
                  <td>{comment.name}</td>
                  <td>{comment.email}</td>
                  <td>{comment.body}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <p className='mt-2 mb-2' >Note: If the post title hasn't appeared yet, it's still loading. Try checking other post titles on different pages using pagination.</p>
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        </Col>
      </Row>
    </Container>
  );
}
