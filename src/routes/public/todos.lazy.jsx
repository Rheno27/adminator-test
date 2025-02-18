import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { useQuery, useQueries } from '@tanstack/react-query';
import { Table, Container, Row, Col, InputGroup, Form } from 'react-bootstrap';
import { AppNavbar, Sidebar } from '../../components/navbar';
import { getTodos } from '../../services/todos';
import { getUserById } from '../../services/users';
import PaginationComponent from '../../components/pagination';
import SearchBar from '../../components/SearchBar';

export const Route = createLazyFileRoute('/public/todos')({
    component: TodosTable,
});

function TodosTable() {
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

    const { data: todosList = [], isLoading, error } = useQuery({
        queryKey: ['todos'],
        queryFn: getTodos,
    });

    const userQueries = useQueries({
        queries: todosList.map((todo) => ({
            queryKey: ['user', todo.user_id],
            queryFn: () => getUserById(todo.user_id),
            enabled: !!todo.user_id,
        })),
    });

    const userDetails = userQueries.reduce((acc, query, index) => {
        if (query.data) {
            acc[todosList[index].user_id] = query.data.name;
        }
        return acc;
    }, {});

    function formatDate(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-IN', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        }).format(date);
    }

    const sortedTodos = [...todosList].sort((a, b) => {
        const keyA = sortConfig.key === 'user_id' ? (userDetails[a.user_id] || '') : a[sortConfig.key];
        const keyB = sortConfig.key === 'user_id' ? (userDetails[b.user_id] || '') : b[sortConfig.key];

        if (keyA < keyB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (keyA > keyB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const filteredTodos = sortedTodos.filter((todo) =>
        todo.id.toString().includes(search) ||
        (userDetails[todo.user_id] || '').toLowerCase().includes(search.toLowerCase()) ||
        todo.title.toLowerCase().includes(search.toLowerCase()) ||
        formatDate(todo.due_on).toLowerCase().includes(search.toLowerCase()) ||
        todo.status.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredTodos.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTodos = filteredTodos.slice(indexOfFirstItem, indexOfLastItem);

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
                    <h3>Todos List</h3>
                    <SearchBar search={search} setSearch={setSearch} />

                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th onClick={() => setSortConfig({ key: 'id', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' })}>
                                    ID {sortConfig.key === 'id' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                                </th>
                                <th onClick={() => setSortConfig({ key: 'user_id', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' })}>
                                    Name {sortConfig.key === 'user_id' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                                </th>
                                <th onClick={() => setSortConfig({ key: 'title', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' })}>
                                    Title {sortConfig.key === 'title' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                                </th>
                                <th onClick={() => setSortConfig({ key: 'due_on', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' })}>
                                    Due On {sortConfig.key === 'due_on' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                                </th>
                                <th onClick={() => setSortConfig({ key: 'status', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' })}>
                                    Status {sortConfig.key === 'status' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentTodos.map((todo) => (
                                <tr key={todo.id}>
                                    <td>{todo.id}</td>
                                    <td>{userDetails[todo.user_id] || 'Loading...'}</td>
                                    <td>{todo.title}</td>
                                    <td>{formatDate(todo.due_on)}</td>
                                    <td>
                                        {todo.status === 'completed' ? (
                                            <>
                                                <i className="bi bi-check-circle-fill text-success"></i> Completed
                                            </>
                                        ) : todo.status === 'pending' ? (
                                            <>
                                                <i className="bi bi-x-circle-fill text-danger"></i> Pending
                                            </>
                                        ) : (
                                            '-'
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <p className='mt-2 mb-2' >Note: If the user's name hasn't appeared yet, it's still loading. Try checking other users' names on different pages using pagination.</p>
                    <PaginationComponent
                        currentPage={currentPage}
                        totalPages={totalPages}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={handleItemsPerPageChange}
                    />
                </Col>
            </Row>
        </Container>
    );
}
