import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { useState } from 'react';


export const Route = createRootRoute({
    component: () => {
        return (
            <>
            <Outlet />
            <TanStackRouterDevtools />
            </>
        );
        },
});