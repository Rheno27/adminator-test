import { Navbar, Nav, Container, Modal, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useNavigate } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import profile from '../assets/profile_default.png';
import Label from '../assets/Label.png';
import LabelDark from '../assets/Label-Dark.png';
import { toast } from 'react-toastify';
import { deleteUser as deleteUserService } from '../services/users';
import { useState } from 'react';


function Sidebar() {
    const user = JSON.parse(localStorage.getItem("user"));
    const [showModal, setShowModal] = useState(false);
    const [confirmText, setConfirmText] = useState("");

    const mutation = useMutation({
        mutationFn: deleteUserService,
        onSuccess: () => {
            localStorage.removeItem("user");
            window.location.reload();
            toast.success('Account deleted successfully');
            navigate({to: '/login'});
        },
        onError: (error) => {
            console.error("Failed to delete account:", error);
            toast.error('Failed to delete account');
        }
    });

    const handleDeleteAccount = () => {
        if (confirmText === "CONFIRM") {
            mutation.mutate(user.id);
            setShowModal(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        window.location.reload();
    };

    return (
        <div 
            className="sidebar" 
            style={{ 
                height: "100vh",
                position: "fixed",
                top: 0,
                left: 0,
                width: "200px",
                overflowY: "auto",
                backgroundColor: "#000000",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingTop: "20px"
            }}
        >
            <img src={LabelDark} alt="Logo" style={{ width: '60px', marginBottom: '20px' }} />
            <Nav className="flex-column" style={{ textAlign: "center", width: "100%" }}>
                <Nav.Link as={Link} to="/" className="text-white">
                    <i className="bi bi-house-fill me-2"></i>Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/public/users" className="text-white">
                    <i className="bi bi-people-fill me-2"></i>List Users
                </Nav.Link>
                <Nav.Link as={Link} to="/public/posts" className="text-white">
                    <i className="bi bi-file-earmark-post-fill me-2"></i>List Posts
                </Nav.Link>
                <Nav.Link as={Link} to="/public/comments" className="text-white">
                    <i className="bi bi-chat-left-dots-fill me-2"></i>List Comments
                </Nav.Link>
                <Nav.Link as={Link} to="/public/todos" className="text-white">
                    <i className="bi bi-building-check me-2"></i>List Todos
                </Nav.Link>

                {user ? (
                    <>
                        <Nav.Link as="button" onClick={handleLogout} className="text-danger mt-3">
                            <i className="bi bi-box-arrow-right me-2"></i>
                            Logout
                        </Nav.Link>

                        {/* Delete Account Button */}
                        <Nav.Link 
                            as="button" 
                            onClick={() => setShowModal(true)} 
                            className="text-danger mt-auto mb-3" 
                            style={{ position: "absolute", bottom: "20px" }}
                        >
                            <i className="bi bi-trash-fill me-2"></i>
                            Delete Account
                        </Nav.Link>
                    </>
                ) : (
                    <Nav.Link as={Link} to="/login" className="text-white">
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Login
                    </Nav.Link>
                )}
            </Nav>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                    <Form.Group className="mt-3">
                        <Form.Label>Type <b>CONFIRM</b> to proceed:</Form.Label>
                        <Form.Control 
                            type="text" 
                            value={confirmText} 
                            onChange={(e) => setConfirmText(e.target.value)} 
                            placeholder="CONFIRM"
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button 
                        variant="danger" 
                        onClick={handleDeleteAccount} 
                        disabled={confirmText !== "CONFIRM" || mutation.isLoading}
                    >
                        {mutation.isLoading ? "Deleting..." : "Delete"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}


function AppNavbar() {
    const navigate = useNavigate(); 

    const handleProfileClick = () => {
        navigate({to: '/'}); 
    };

    return (
        <Navbar bg="white" expand="lg" className="navbar-custom">
            <Container fluid>
                <Navbar.Brand style={{ width: 'auto', height: 'auto'}}>
                    <img 
                        src={Label} 
                        alt="Logo"
                        width="30%" 
                    />
                </Navbar.Brand>
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
