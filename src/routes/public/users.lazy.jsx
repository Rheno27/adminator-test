import { createLazyFileRoute, useNavigate  } from '@tanstack/react-router'
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, Form, InputGroup, Button, Pagination, Container, Row, Col } from 'react-bootstrap';
import { AppNavbar, Sidebar } from '../../components/navbar';
import { getUser } from '../../services/users';
import PaginationComponent from '../../components/pagination';
import SearchBar from '../../components/SearchBar';
export const Route = createLazyFileRoute('/public/users')({
  component: UserTable,
})

function UserTable() {
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
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
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1); 
  };

  return (
    <Container fluid>
        <Row>
          <Col md={2} className="p-0">
            <Sidebar />
          </Col>
          <Col md={10} className="p-0 px-3">
            <AppNavbar />
            <h3>Users List</h3>
            <SearchBar search={search} setSearch={setSearch} />
            <Table striped bordered hover responsive className="text-center">
              <thead >
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
                    <td>
                      {user.gender === 'male' ? (
                        <>
                          <i className="bi bi-gender-male" style={{ color: 'blue' }}></i> Male
                        </>
                      ) : user.gender === 'female' ? (
                        <>
                          <i className="bi bi-gender-female" style={{ color: 'pink' }}></i> Female
                        </>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>
                      {user.status === 'active' ? (
                        <>
                          <i className="bi bi-check-circle-fill text-success"></i> Active
                        </>
                      ) : user.status === 'inactive' ? (
                        <>
                          <i className="bi bi-x-circle-fill text-danger"></i> Inactive
                        </>
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <PaginationComponent 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={setCurrentPage} 
              itemsPerPage={itemsPerPage} 
              onItemsPerPageChange={handleItemsPerPageChange} 
            />
          </Col>
        </Row>
    </Container>
  );
}
