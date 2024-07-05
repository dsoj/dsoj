import React from "react";
import NavBar from "@/components/navbar";
import { ReactElement } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";


const Layout = ({ children }: any) => {
    return (
        <div>
            <NavBar />
            {children}
        </div>
    );
}

export default Layout;