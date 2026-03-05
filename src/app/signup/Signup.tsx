"use client";
import Image from 'next/image';
import logo from '@/asset/logo_s.png';
import { useCallback, useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';

export default function SignUp() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [message, setMessage] = useState('');
    const [isFetching, setIsFetching] = useState(false);



    const SignUp = useCallback(() => {
        setIsFetching(true);
        fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: username,
                email: email,
                password: password,
                nickname: nickname,
            })
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    window.location.href = '/login';
                } else {
                    setMessage(data.message);
                    setIsFetching(false);
                }
            });
    }, [username, email, password, nickname]);

    return (
        <div className="position-relative py-4 py-xl-5">
            <Container>
                <Row className="d-flex justify-content-center">
                    <Col md={6} xl={4}>
                        <Card className="mb-5">
                            <Card.Body className="d-flex flex-column align-items-center">
                                <h2 style={{ marginBottom: "2rem" }}>
                                    <Image src={logo.src} width={40} height={40} alt="logo" />
                                    &nbsp; Sign up
                                </h2>
                                <Form className="text-center" method="post" style={{ width: "20rem" }}>
                                    <Form.Group className="mb-3">
                                        <p style={{ color: "red" }}>{message}</p>
                                        <p style={{ textAlign: "left", marginBottom: "0.5rem" }}>
                                            Username
                                        </p>
                                        <Form.Control
                                            type="text"
                                            placeholder="Username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            disabled={isFetching}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <p style={{ textAlign: "left", marginBottom: "0.5rem" }}>Email</p>
                                        <Form.Control
                                            type="email"
                                            placeholder="Email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={isFetching}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <p style={{ textAlign: "left", marginBottom: "0.5rem" }}>
                                            Password
                                        </p>
                                        <Form.Control
                                            type="password"
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            disabled={isFetching}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <p style={{ textAlign: "left", marginBottom: "0.5rem" }}>
                                            Password (again)
                                        </p>
                                        <Form.Control
                                            type="password"
                                            placeholder="Password (again)"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            disabled={isFetching}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <p style={{ textAlign: "left", marginBottom: "0.5rem" }}>
                                            Nickname (hidden)
                                        </p>
                                        <Form.Control
                                            type="text"
                                            placeholder="Name"
                                            value={nickname}
                                            onChange={(e) => setNickname(e.target.value)}
                                            disabled={isFetching}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Button
                                            variant="primary"
                                            className="d-block w-100"
                                            style={{ background: "#4CAF50", marginTop: "2rem" }}
                                            onClick={SignUp}
                                            disabled={isFetching}
                                        >
                                            Sign up
                                        </Button>
                                    </Form.Group>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};;