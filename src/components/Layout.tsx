import React from "react";
import NavBar from "@/components/navbar";
import HeadComponent from "./head";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";


export default function Layout({ children }: any) {
    return (
        <div>
            <HeadComponent />
            <NavBar />
            {children}
        </div>
    );
};