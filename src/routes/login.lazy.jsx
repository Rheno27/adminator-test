import { createLazyFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { getUserByEmail } from '../services/users';
import { Form, Button, Container, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import '../styles/auth.css';

export const Route = createLazyFileRoute('/login')({
  component: Login,
});

function Login() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
  
    if (!name || !email) {
      toast.error('Nama dan email harus diisi!');
      return;
    }
  
    try {
      const user = await getUserByEmail(name, email);
  
      if (!user || Object.keys(user).length === 0) {
        toast.error('User tidak ditemukan');
        return;
      }
  
      localStorage.setItem('user', JSON.stringify(user));
      toast.success('Login successful');
      navigate({to: '/' });
    } catch (error) {
      toast.error(error.message || 'Gagal mendapatkan data pengguna');
    }
  };
  
  return (
    <div className="auth-container d-flex justify-content-center align-items-center">
      <Card className="auth-card p-4">
        <Card.Body>
          <h2 className="text-center">Login To</h2>
          <h2 className="text-center">ADMINATOR</h2>
          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Login
            </Button>
          </Form>
          <div className="text-center mt-3">
            <p>Don't have an account? <span className="text-primary" style={{cursor: 'pointer'}} onClick={() => navigate({ to: '/register' })}>Register here</span></p>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}