import { Navbar, StaffNavbar } from "../../components/Navbar";
import { Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { ROLES } from "../../consts/index";

export const RootLayout = () => {
    const { auth } = useAuth();
    const {roles} = auth ?? {};
    let isAdmin = roles?.includes(ROLES.admin) || roles?.include(ROLES.superviser);
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
                <Outlet />

            </main>
        </>
    );
}