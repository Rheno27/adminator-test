import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, Form, InputGroup, Pagination, Container, Row, Col } from 'react-bootstrap';
import { AppNavbar, Sidebar } from '../../components/navbar';
import { getPosts } from '../../services/posts';

export const Route = createLazyFileRoute('/public/posts')({
  component: PostsTable,
});

function PostsTable() {
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

  const { data: postsList, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await getPosts();
      return response;
    },
  });

  

  const sortedPosts = Array.isArray(postsList) ? [...postsList].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  }) : [];

  const filteredPosts = sortedPosts.filter((post) =>
    post.id.toString().includes(search) ||
    post.title.toLowerCase().includes(search.toLowerCase()) ||
    post.body.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);

  return (
    <Container fluid>   
      <Row>
        <Col md={2} className="p-0">
          <Sidebar />
        </Col>
        <Col md={10} className="p-0">
          <AppNavbar />
          <h3>Posts List</h3>
          <InputGroup className="mb-3">
            <Form.Control
              type="text"
              placeholder="Search by title"
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
                <th onClick={() => setSortConfig({ key: 'title', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' })}>
                  Title {sortConfig.key === 'title' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th>Body</th>
              </tr>
            </thead>
            <tbody>
              {currentPosts.map((post) => (
                <tr key={post.id}>
                  <td>{post.id}</td>
                  <td>{post.title}</td>
                  <td>{post.body}</td>
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
