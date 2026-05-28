
import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";

function Layout() {
    const location = useLocation();
    
    useEffect(() => {
        if (location.hash === '#catalog') {
            setTimeout(() => {
                const catalogSection = document.getElementById('catalog');
                if (catalogSection) {
                    catalogSection.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }
    }, [location]);
    
    return (
        <>
            <Outlet />
        </>
    );
}

export default Layout;