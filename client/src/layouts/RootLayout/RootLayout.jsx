import { Navbar, NewNavbar } from "../../components/Navbar";
import { Outlet, Route } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { ROLES } from "../../consts/index";
import { ClassNames } from "@emotion/react";
import { useContext } from "react";
import { LogsStatusFilterProvider } from "../../contexts/LogsStatusFilterProvider";

export const RootLayout = () => {
    return (
        <>
            <nav>
                <NewNavbar />
            </nav>
            <main className='mt-[64px] min-h-[calc(100vh-64px)]  bg-gray-50 w-full' style={{ position: 'relative' }}>
                <LogsStatusFilterProvider>
                    <Outlet />
                </LogsStatusFilterProvider>
            </main>
        </>
    );
}