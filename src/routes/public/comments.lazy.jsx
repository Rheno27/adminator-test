import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, Form, InputGroup, Pagination, Container, Row, Col } from 'react-bootstrap';
import { AppNavbar, Sidebar } from '../../components/navbar';
import { getComments } from '../../services/comments';

export const Route = createLazyFileRoute('/public/comments')({
  component: CommentsTable,
});

function CommentsTable() {
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate({to: '/login'});
    }
  }, [navigate]);

  const { data: commentsList, isLoading, error } = useQuery({
    queryKey: ['comments'],
    queryFn: async () => {
      const response = await getComments();
      return response;
    },
  });

  const sortedComments = Array.isArray(commentsList) ? [...commentsList].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  }) : [];

  const filteredComments = sortedComments.filter((comment) =>
    comment.id.toString().includes(search) ||
    comment.post_id.toString().includes(search) ||
    comment.name.toLowerCase().includes(search.toLowerCase()) ||
    comment.email.toLowerCase().includes(search.toLowerCase()) ||
    comment.body.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentComments = filteredComments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredComments.length / itemsPerPage);

  return (
    <Container fluid>
      <Row>
        <Col md={2} className="p-0">
          <Sidebar />
        </Col>
        <Col md={10} className="p-0">
          <AppNavbar />
          <h3>Comments List</h3>
          <InputGroup className="mb-3">
            <Form.Control
              type="text"
              placeholder="Search by id, post_id, name, email, body"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th onClick={() => setSortConfig({ key: 'id', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' })}>
                  ID {sortConfig.key === 'id' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th onClick={() => setSortConfig({ key: 'post_id', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' })}>
                  Post ID {sortConfig.key === 'post_id' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th onClick={() => setSortConfig({ key: 'name', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' })}>
                  Name {sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th onClick={() => setSortConfig({ key: 'email', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' })}>
                  Email {sortConfig.key === 'email' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th>Body</th>
              </tr>
            </thead>
            <tbody>
              {currentComments.map((comment) => (
                <tr key={comment.id}>
                  <td>{comment.id}</td>
                  <td>{comment.post_id}</td>
                  <td>{comment.name}</td>
                  <td>{comment.email}</td>
                  <td>{comment.body}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination>
            {[...Array(totalPages).keys()].map((number) => (
              <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => setCurrentPage(number + 1)}>
                {number + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </Col>
      </Row>
    </Container>
  );
}
