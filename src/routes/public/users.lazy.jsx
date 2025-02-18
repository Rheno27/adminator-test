import { createLazyFileRoute, useNavigate  } from '@tanstack/react-router'
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, Form, InputGroup, Button, Pagination, Container, Row, Col } from 'react-bootstrap';
import { AppNavbar, Sidebar } from '../../components/navbar';
import { getUser } from '../../services/users';
export const Route = createLazyFileRoute('/public/users')({
  component: UserTable,
})

function UserTable() {
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

  const { data: usersList, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await getUser();
      return response;
    },
  });
  

  // Sorting function
  const sortedUsers = Array.isArray(usersList) ? [...usersList].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  }) : [];
  

  // Filtering based on search input
  const filteredUsers = sortedUsers.filter((userList) =>
    userList.id.toString().includes(search) ||
    userList.name.toLowerCase().includes(search.toLowerCase()) ||
    userList.email.toLowerCase().includes(search.toLowerCase()) ||
    userList.gender.toLowerCase().includes(search.toLowerCase()) ||
    userList.status.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  return (
    <>
      <Container fluid>
        <Row>
          <Col md={2} className="p-0">
            <Sidebar />
          </Col>
          <Col md={10} className="p-0">
            <AppNavbar />
            <h3>Users List</h3>
            <InputGroup className="mb-3">
              <Form.Control
                type="text"
                placeholder="Search by name or email"
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
                  <th onClick={() => setSortConfig({ key: 'name', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' })}>
                    Name {sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                  </th>
                  <th>Email</th>
                  <th>Gender</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.gender}</td>
                    <td>{user.status}</td>
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
    </>
  );
}
