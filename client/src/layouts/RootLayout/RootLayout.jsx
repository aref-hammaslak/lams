import { Navbar, StaffNavbar } from "../../components/Navbar";
import { Outlet, Route } from "react-router-dom";
import LogFillingProvider from "../../contexts/LogFillingProvider";
import useAuth from "../../hooks/useAuth";
import { ROLES } from "../../consts/index";

export const RootLayout = () => {
    const { auth } = useAuth();
    const { roles } = auth ?? {};
    let isAdmin = roles?.includes(ROLES.admin) || roles?.include(ROLES.superviser);
    // isAdmin = false;
    return (
        <>
            <nav>
                {
                    isAdmin ?
                        <Navbar /> :
                        <StaffNavbar />
                }
            </nav>
            <main style={{ position: 'relative' }}>
                <LogFillingProvider>
                    <Outlet />
                </LogFillingProvider>
            </main>
        </>
    );
}