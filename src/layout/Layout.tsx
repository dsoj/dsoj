import React from "react";
import NavBar from "@/layout/navbar";
import { ReactElement } from "react";

import "bootstrap/dist/css/bootstrap.min.css";


const Layout = ({ children }: any) => {
    return (
        <div>
            <NavBar />
            {children}
        </div>
    );
}

export default Layout;