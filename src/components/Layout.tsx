import React from "react";
import NavBar from "@/components/navbar";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import HeadComponent from "./head";


const Layout = ({ children }: any) => { 
    return (
        <div>
            <HeadComponent />
            <NavBar />
            {children}
        </div>
    );
}

export default Layout;