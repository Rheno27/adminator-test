import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Row, Col } from 'react-bootstrap';
import { AppNavbar, Sidebar } from '../components/navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export const Route = createRootRoute({
    component: () => {
        return (
            <>
            <Row>
                <Col md={2} className="p-0">
                    <Sidebar />
                </Col>
                <Col md={10} className="p-0">
                    <AppNavbar />
                    <Outlet />
                </Col>
            </Row>
            <TanStackRouterDevtools />
            <ToastContainer limit={3} />
            </>
        );
        },
});