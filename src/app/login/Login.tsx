"use client";
import Image from 'next/image';
import logo from '@/asset/logo_s.png';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

import Link from 'next/link';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';


export default function Login() {
    const callbackUrl = useSearchParams().get('callbackUrl');
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isFetching, setIsFetching] = useState(false);

    async function Login() {
        setIsFetching(true);
        // vaildate input
        if (name === "" || password === "") {
            setMessage("Please enter username and password.");
            setIsFetching(false);
            return;
        }

        fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: name,
                password: password,
            }),
        })
            .then((res) => res.json())
            .then(json => {
                if (json.success) {
                    window.location.href = callbackUrl || '/';
                } else {
                    setMessage(json.message);
                    setIsFetching(false);
                }
            })
            .catch((err) => {
                console.error(err);
                setMessage("Server error.");
                setIsFetching(false);
            });
    }

    function onKeyDown(e: any) {
        if (e.key === 'Enter') {
            Login();
        }
    }

    return (
        <div className="position-relative py-4 py-xl-5">
            <Container>
                <Row className="d-flex justify-content-center">
                    <Col md={6} xl={4}>
                        <Card className="mb-5">
                            <Card.Body className="d-flex flex-column align-items-center">
                                <h2 style={{ marginBottom: '2rem' }}><Image src={logo.src} width={40} height={40} alt="logo" /> Log in</h2>
                                <div className="text-center">
                                    <p style={{ color: "red" }}>{message}</p>
                                    <Form.Group className="mb-3">
                                        <Form.Control disabled={isFetching} type="text" name="username" placeholder="User Name" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={onKeyDown} />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Control type="password" disabled={isFetching} name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={onKeyDown} />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Button variant="primary" className="d-block w-100" type="button" disabled={isFetching} style={{ marginTop: "2rem" }} onClick={Login}>
                                            <span>Login</span>
                                        </Button>
                                    </Form.Group>

                                    {/* <p className="text-muted">Forgot password?</p> */}
                                    <p style={{ borderTop: "1px solid var(--bs-body-color)", marginBottom: "0.5rem", paddingTop: "1rem" }}>Wanna start a new journey with <strong>DSOJ</strong>?</p>
                                    <Link href="/signup" className="btn btn-primary d-block w-100" style={{ background: "#4CAF50", border: 0 }}>
                                        <span>Sign up</span>
                                    </Link>
                                    <br />
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}