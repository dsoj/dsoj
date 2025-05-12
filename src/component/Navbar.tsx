"use client";
import { Navbar, Container, Nav, NavItem, NavLink, Spinner } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { usePathname } from "next/navigation";
import logo from '@/asset/logo_s.png';
import Image from 'next/image';
import { useEffect } from "react";
import { useSession } from '@/context/sessionState';
import { LoginRequiredPages, LogoutRequiredPages } from '@/constant/Session';
import { getCookie } from 'cookies-next';


export default function NavComponent() {
    const pathname = usePathname() ?? '';

    const { isLoggedIn, setIsLoggedIn } = useSession();

    useEffect(() => {
        // import bootstrap
        import('bootstrap');

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
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    useEffect(() => {
        // check page privileges
        if (isLoggedIn == undefined) {
            return;
        } else if (isLoggedIn == true) {
            // check if username is missing
            const username = getCookie('username');
            if (username == undefined) {
                window.location.href = '/api/auth/logout';
                setIsLoggedIn(false);
                return;
            }

            // check LogoutRequired with logged in session
            for (const path of LogoutRequiredPages) {
                if (pathname == path || pathname.startsWith(path)) {
                    window.location.href = '/';
                    return;
                }
            }
        } else if (isLoggedIn == false) {
            // check LoginRequired with logged out session
            for (const path of LoginRequiredPages) {
                if (pathname == path || pathname.startsWith(path)) {
                    window.location.href = '/login';
                    return;
                }
            }
        }
    }, [isLoggedIn, pathname, setIsLoggedIn]);

    function AccountPart({ isLoggedIn }: { isLoggedIn: boolean | undefined; }) {
        if (isLoggedIn == true) {
            return <Button variant="primary" href="/api/auth/logout">Log out</Button>;
        } else if (isLoggedIn == false) {
            return <Button variant="primary" href="/login">Log in</Button>;
        } else if (isLoggedIn == undefined) {
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
                    <AccountPart isLoggedIn={isLoggedIn} />
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

