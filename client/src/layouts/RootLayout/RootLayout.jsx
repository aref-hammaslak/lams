import {Navbar} from "../../components/Navbar";
import {Outlet} from "react-router-dom";

export const RootLayout = () => {
    return (
        <>
            <nav>
                <Navbar />
            </nav>
            <main style={{ position: 'relative' }}>
                <Outlet />
            </main>
        </>
    );
}