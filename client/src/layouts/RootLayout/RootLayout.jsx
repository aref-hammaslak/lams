import { Navbar, NewNavbar } from "../../components/Navbar";
import { Outlet, Route } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { ROLES } from "../../consts/index";
import { ClassNames } from "@emotion/react";

export const RootLayout = () => {
    const { auth } = useAuth();
    const { roles } = auth ?? {};
    let isAdmin = roles?.includes(ROLES.admin) || roles?.includes(ROLES.superviser);
    isAdmin = false;
    return (
        <>
            <nav>
                {
                    // isAdmin ?
                    <>
                        {/* <Navbar /> */}
                        <NewNavbar />

                    </>
                }
            </nav>
            <main className='mt-[64px]' style={{ position: 'relative' }}>
                    <Outlet />
            </main>
        </>
    );
}