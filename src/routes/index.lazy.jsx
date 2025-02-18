import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { AppNavbar, Sidebar } from '../components/navbar';
import { Container, Row, Col, Card, Form, Button, ListGroup } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { updateUser as updateUserService } from '../services/users';
import { toast } from 'react-toastify';
import profile from '../assets/profile_default.png';

export const Route = createLazyFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
  });
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('user')) {
      navigate({ to: '/login' });
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
      setIsChanged(false);
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
    updateUserMutation({ id: user.id, name: formData.name, email: formData.email });
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.reload();
  };

  return (
    <>
      <Row>
        <Col md={2} className="p-0">
          <Sidebar />
        </Col>
        <Col md={10} className="p-0 px-3">
          <AppNavbar />
          <h3 style={{ marginLeft: '10px' }}>Dashboard</h3>
          <Row>
            <Col md={9}>
              <Container fluid className="d-flex justify-content-start align-items-center mt-4">
              <Card style={{ width: '40rem', padding: '20px' }}>
                <Row>
                  <Col md={4} className="d-flex justify-content-center align-items-center">
                    <Card.Img variant="top" src={profile} style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '50%' }} />
                  </Col>
                  <Col md={8}>
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

                        <Form.Group controlId="formEmail" className="mt-3">
                          <Form.Label>Gender</Form.Label>
                          <Form.Control
                            type="text"
                            name="gender"
                            value={user.gender}
                            disabled
                          />
                        </Form.Group>

                        <Form.Group controlId="formEmail" className="mt-3">
                          <Form.Label>Status</Form.Label>
                          <Form.Control
                            type="text"
                            name="status"
                            value={user.status}
                            disabled
                          />
                        </Form.Group>

                        <Row className="mt-3">
                          <Col md={6} className="text-start">
                            <Button type="submit" variant="primary" disabled={!isChanged || isUpdating}>
                              {isUpdating ? 'Saving...' : 'Update'}
                            </Button>
                          </Col>
                          <Col md={6} className="text-end">
                            <Button variant="danger" onClick={handleLogout}>
                              Logout
                            </Button>
                          </Col>
                        </Row>
                      </Form>
                    </Card.Body>
                  </Col>
                </Row>
              </Card>
            </Container>
            </Col>
            <Col md={3}>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}