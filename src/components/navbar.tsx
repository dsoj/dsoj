"use client";
import { Navbar, Container, Nav, NavItem, NavLink, Spinner } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { usePathname } from "next/navigation";
import logo from '@/assets/logo_s.png';
import Image from 'next/image';
import { useCallback, useEffect, useState } from "react";

export default function NavComponent() {
    const pathname = usePathname() ?? '';
    const [isLogin, setIsLogin] = useState<boolean | undefined>(undefined);

    const LoginRequired = [
        "/problem",
        "/about",
    ];

    const LogoutRequired = [
        "/login",
    ];


    useEffect(() => {
        // check if user is already logged in
        fetch('/api/auth/session', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then(json => {
                if (json.session) {
                    setIsLogin(true);
                } else {
                    setIsLogin(false);
                }

            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    useEffect(() => {
        // check page privileges
        if (isLogin == undefined) {
            return;
        } else if (isLogin == true) {
            // check other page with logged out session
            for (const path of LogoutRequired) {
                if (pathname == path) {
                    window.location.href = '/';
                    return;
                }
            }
        } else if (isLogin == false) {
            // check login page with logged session
            for (const path of LoginRequired) {
                if (pathname == path) {
                    window.location.href = '/';
                    return;
                }
            }
        }
    }, [isLogin]);

    function AccountPart({ isLogin }: { isLogin: boolean | undefined; }) {
        if (isLogin == true) {
            return <Button variant="primary" href="/api/auth/logout">Log out</Button>;
        } else if (isLogin == false) {
            return <Button variant="primary" href="/login">Log in</Button>;
        } else if (isLogin == undefined) {
            return (
                <Button variant="primary" disabled>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                </Button>
            );
        }
    }

    // TODO: navbar sticky position
    return (
        <Navbar bg="light" expand="md">
            <Container>
                <Navbar.Brand href="/">
                    <Image src={logo.src} width="40" height="40" alt="dsoj-logo" />
                    <strong><span style={{ marginLeft: "0.5rem" }}>DSOJ</span></strong>
                </Navbar.Brand>

                <Navbar.Toggle />

                <Navbar.Collapse>
                    <Nav className="mx-auto" activeKey={`/${pathname.split('/')[0]}`}>
                        {/* TODO: Add NavItem color by checking path */}
                        <NavItem>
                            <NavLink href="/">Home</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/problem">Problems</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/about">About</NavLink>
                        </NavItem>
                    </Nav>
                    <AccountPart isLogin={isLogin} />
                </Navbar.Collapse>

            </Container>
        </Navbar>
    );
}

