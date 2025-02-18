import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Button, Form, Card, Container } from 'react-bootstrap';
import { useMutation } from '@tanstack/react-query';
import { createUser as createUserService } from '../services/users';
import { toast } from 'react-toastify';
import '../styles/auth.css'; 

export const Route = createLazyFileRoute('/register')({
  component: CreateUser,
}); 

function CreateUser() {
  const [name, setName] = useState('');
  const [gender, setGender] = useState(''); 
  const [email, setEmail] = useState('');
  const [status] = useState('active'); 
  const navigate = useNavigate();

  const { mutate: createUser, isPending } = useMutation({
    mutationFn: createUserService, 
    onSuccess: () => {
      navigate({ to: '/login' });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create user');
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
        toast.error('Name cannot be empty');
        return;
    }

    if (name.length > 30) {
        toast.error('Name cannot exceed 30 characters');
        return;
    }

    if (!email.trim()) {
        toast.error('Email cannot be empty');
        return;
    }

    if (!email.includes('@example.example')) {
        toast.error('Email must end with @example.example');
        return;
    }

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/public/v2/users?email=${email}`, {
            headers: {
                "Authorization": `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`
            }
        });

        const users = await response.json();

        if (users.length > 0) {
            toast.error('Email is already registered');
            return;
        }

        await createUser({ name, gender, email, status });
        toast.success('User registered successfully');
    } catch (error) {
        toast.error(`Registration failed: ${error.message}`);
    }
};



  return (
    <div className="auth-container">
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Card className="auth-card p-4">
          <Card.Body>
            <h2 className="text-center mb-4">Register</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formGender" className="mt-3">
                <Form.Label>Gender</Form.Label>
                <Form.Control
                  as="select"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                >
                  <option value="" disabled >Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="formEmail" className="mt-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="email@example.example"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Button className="w-100 mt-4" variant="primary" type="submit" disabled={isPending}>
                Create Account
              </Button>
              
              <div className="text-center mt-3">
                <p>Already have an account? <span className="text-primary" style={{cursor: 'pointer'}} onClick={() => navigate({ to: '/login' })}>Login here</span></p>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}
