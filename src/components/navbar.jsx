import { Navbar, Nav, Container, Dropdown, Offcanvas, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useNavigate } from '@tanstack/react-router';
import profile from '../assets/profile_default.png';

function Sidebar() {
const user = JSON.parse(localStorage.getItem('user'));

const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.reload();
};

return (
    <div 
    className="bg-dark text-white p-3" 
    style={{ 
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '200px',
        overflowY: 'auto'
    }}
    >
    <h4>Admin Panel</h4>
        <Nav className="flex-column">
            <Nav.Link as={Link} to="/" className="text-white">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/public/users" className="text-white">List Users</Nav.Link>
            <Nav.Link as={Link} to="/public/posts" className="text-white">List Posts</Nav.Link>
            <Nav.Link as={Link} to="/public/comments" className="text-white">List Comments</Nav.Link>
            <Nav.Link as={Link} to="/public/todos" className="text-white">List Todos</Nav.Link>
            {user ? (
            <Nav.Link as="button" onClick={handleLogout} className="text-danger">
                Logout
            </Nav.Link>
            ) : (
            <Nav.Link as={Link} to="/login" className="text-white">
                Login
            </Nav.Link>
            )}
        </Nav>
    </div>
);
}

function AppNavbar() {
    const navigate = useNavigate(); 

    const handleProfileClick = () => {
        navigate({to: '/profil'}); 
    };

    return (
        <Navbar bg="white" expand="lg" className="px-3">
            <Container fluid>
                <Navbar.Brand href="#">Admin Dashboard</Navbar.Brand>
                <Nav className="ms-auto">
                    <button 
                        onClick={handleProfileClick} 
                        style={{ border: 'none', background: 'none', padding: 0 }}
                    >
                        <img 
                            src={profile} 
                            alt="Profile"
                            className="rounded-circle"
                            width="30"
                            height="30"
                        />
                    </button>
                </Nav>
            </Container>
        </Navbar>
    );
}

export { AppNavbar, Sidebar };
