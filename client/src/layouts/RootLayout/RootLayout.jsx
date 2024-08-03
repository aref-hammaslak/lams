import {Navbar} from "../../components/Navbar";
import {Outlet} from "react-router-dom";
import { useContext } from "react";
import { AlertContext } from "../../contexts/AlertProvider";
import Alert from '../../components/Alert/Alert'

export const RootLayout = () => {
    const alertState = useContext(AlertContext)
    return (
        <>
            <nav>
                <Navbar />
            </nav>
            <main style={{ position: 'relative' }}>
                <Outlet />
                
            </main>
            <Alert {...alertState}/>
        </>
    );
}