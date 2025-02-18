import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export const Route = createRootRoute({
    component: () => {
        return (
            <>
            <Outlet />
            <TanStackRouterDevtools />
            <ToastContainer limit={3} />
            </>
        );
        },
});