import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import { Card, Form, Button, Container, Row, Col, ListGroup } from 'react-bootstrap';
import profile from '../assets/profile_default.png';
import { updateUser as updateUserService } from '../services/users';
import { useMutation } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export const Route = createLazyFileRoute('/profil')({
    component: Profile,
});

function Profile() {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    const [formData, setFormData] = useState({
        name: user.name || '',
        email: user.email || ''
    });
    const [isChanged, setIsChanged] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (!user) {
            navigate({to: '/login'});
        }
    }, [navigate]);
    
    useEffect(() => {
        setIsChanged(formData.name !== user.name || formData.email !== user.email);
    }, [formData, user]);

    const { mutate: updateUserMutation, isPending: isUpdating } = useMutation({
        mutationFn: updateUserService,
        onSuccess: (data) => {
            toast.success(data.message || 'User updated successfully!');
            localStorage.setItem('user', JSON.stringify({ ...user, ...formData }));
            setIsChanged(false); // Reset state perubahan setelah update berhasil
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update user');
        },
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.email.includes('@example.example')) {
            toast.error('Email harus mengandung "@example.example"');
            return;
        }
        updateUserMutation({
            id: user.id,
            name: formData.name,
            email: formData.email,
        });
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.reload();
    };

    return (
        <Container fluid>
            <Card style={{ width: '22rem', margin: 'auto', marginTop: '20px', padding: '10px' }}>
                <Card.Img variant="top" src={profile} style={{ width: '100px', height: '100px', objectFit: 'cover', margin: 'auto' }} />
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formEmail" className="mt-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        {/* Data user lainnya ditampilkan saja */}
                        <ListGroup className="mt-3">
                            <ListGroup.Item><strong>Gender: </strong> {user.gender || 'Unknown'}</ListGroup.Item>
                            <ListGroup.Item><strong>Status: </strong> {user.status || 'Unknown'}</ListGroup.Item>
                        </ListGroup>

                        <Row className="mt-3">
                            <Col md={6} className="text-center">
                                <Button type="submit" variant="primary" disabled={!isChanged || isUpdating}>
                                    {isUpdating ? 'Saving...' : 'Update'}
                                </Button>
                            </Col>
                            <Col md={6} className="text-center">
                                <Button variant="danger" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}
