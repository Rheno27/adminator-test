import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, Form, InputGroup, Pagination, Container, Row, Col } from 'react-bootstrap';
import { AppNavbar, Sidebar } from '../../components/navbar';
import { getTodos } from '../../services/todos';

export const Route = createLazyFileRoute('/public/todos')({
    component: TodosTable,
});

function TodosTable() {
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

    const { data: todosList, isLoading, error } = useQuery({
        queryKey: ['todos'],
        queryFn: async () => {
            const response = await getTodos();
            return response;
        },
    });


    const sortedTodos = Array.isArray(todosList) ? [...todosList].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    }) : [];

    const filteredTodos = sortedTodos.filter((todo) =>
        todo.id.toString().includes(search) ||
        todo.user_id.toString().includes(search) ||
        todo.title.toLowerCase().includes(search.toLowerCase()) ||
        todo.due_on.toLowerCase().includes(search.toLowerCase()) ||
        todo.status.toLowerCase().includes(search.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTodos = filteredTodos.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredTodos.length / itemsPerPage);

    return (
        <Container fluid>
            <Container>
                <h3>Todos List</h3>
                <InputGroup className="mb-3">
                <Form.Control
                    type="text"
                    placeholder="Search by id, user_id, title, due_on, status"
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
                    <th onClick={() => setSortConfig({ key: 'user_id', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' })}>
                        User ID {sortConfig.key === 'user_id' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
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
                        <td>{todo.user_id}</td>
                        <td>{todo.title}</td>
                        <td>{todo.due_on}</td>
                        <td>{todo.status}</td>
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
            </Container>
        </Container>
    );
}
