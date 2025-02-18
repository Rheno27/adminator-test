import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import { AppNavbar, Sidebar } from '../components/navbar'
import { Container, Row, Col } from 'react-bootstrap'
import { useEffect } from 'react';
export const Route = createLazyFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate({to: '/login'}); 
    }
  }, [navigate]);

  return (
    <>
      <Row>
        <Col md={2} className="p-0">
          <Sidebar />
        </Col>
        <Col md={10} className="p-0">
          <AppNavbar />
          <Container fluid>
          </Container>
        </Col>
      </Row>
    </>
  );
}
