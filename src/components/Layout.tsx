import React from "react";
import NavBar from "@/components/navbar";
import { SessionProvider } from "next-auth/react";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";


const Layout = ({ children }: any) => { 
    return (
        <SessionProvider>
            <div>
                <NavBar />
                {children}
            </div>
        </SessionProvider>
    );
}

export default Layout;