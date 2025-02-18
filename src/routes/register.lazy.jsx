import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useMutation } from '@tanstack/react-query';
import { createUser as createUserService } from '../services/users';
import { toast } from 'react-toastify';

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.includes('@example.example')) {
      toast.error('Email must end with @example.example');
      return;
    }
    createUser({ name, gender, email, status });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formName">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="formGender">
        <Form.Label>Gender</Form.Label>
        <Form.Control
          as="select"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="" disabled >Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="formEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="email@example.example"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Group>

      <Button variant="primary" type="submit" disabled={isPending}>
        Create User
      </Button>
    </Form>
  );
}

