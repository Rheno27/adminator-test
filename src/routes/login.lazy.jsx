import { createLazyFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { getUserByEmail } from '../services/users';
import { Form, Button, Container } from 'react-bootstrap';
import { toast } from 'react-toastify';

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
    <Container className="mt-5">
      <h2>Login</h2>
      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nama</Form.Label>
          <Form.Control
            type="text"
            placeholder="Masukkan nama"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Masukkan email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
    </Container>
  );
}