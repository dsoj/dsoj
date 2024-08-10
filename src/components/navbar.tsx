import { Navbar, Container, Nav, NavItem, NavLink, Spinner } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { usePathname } from "next/navigation";
import logo from '@/assets/logo_s.png';
import Image from 'next/image';
import axios from "axios";
import { useEffect, useState } from "react";


export default function NavLayout() {
    const pathname = usePathname() ?? '';
    const [sessionState, setSessionState] = useState(2);

    useEffect(() => {
        axios.get(`http://localhost:3000/api/auth/session`)
            .then((res) => {
                if (res.data.session) {
                    setSessionState(1);
                }else{
                    setSessionState(0);
                }
            })
            .catch((err) => {
                console.error(`Error Occurred when Authenticating: ${err}`);
            });
    })

    function AccountPart() {        
        if (sessionState==1) {
            return <Button variant="primary" href="/api/auth/logout">Log out</Button>
        } else if (sessionState==0) {
            return <Button variant="primary" href="/login">Log in</Button>
        } else {
            return (
                <Button variant="primary" disabled>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />   
                </Button>
            )
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
                    <Nav className="mx-auto" activeKey={pathname}>
                        {/* TODO: Add NavItem color by checking path */}
                        <NavItem>
                            <NavLink href="/">Home</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/problem">Problems</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="#">My Submissions</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="#">Support</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/about">About</NavLink>
                        </NavItem>
                    </Nav>
                    <AccountPart />
                </Navbar.Collapse>

            </Container>
        </Navbar>

    )
}


