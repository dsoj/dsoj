"use client";
import Image from 'next/image';
import logo from '@/assets/logo_s.png';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
    const router = useRouter();
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
                    router.push('/');
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
        // TODO: Elements have to be convert to react-bootstrap components
        <div className="position-relative py-4 py-xl-5">
            <div className="container">
                <div className="row d-flex justify-content-center">
                    <div className="col-md-6 col-xl-4">
                        <div className="card mb-5">
                            <div className="card-body d-flex flex-column align-items-center">
                                <h2 style={{ marginBottom: '2rem' }}><Image src={logo.src} width={40} height={40} alt="logo" /> Log in</h2>
                                <div className="text-center">
                                    <p style={{ color: "red" }}>{message}</p>
                                    <div className="mb-3">
                                        <input className="form-control" disabled={isFetching} type="text" name="username" placeholder="User Name" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={onKeyDown} />
                                    </div>

                                    <div className="mb-3">
                                        <input className="form-control" type="password" disabled={isFetching} name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={onKeyDown} />
                                    </div>

                                    <div className="mb-3">
                                        <button className="btn btn-primary d-block w-100" type="button" disabled={isFetching} style={{ marginTop: "2rem" }} onClick={Login}>
                                            <span>Login</span>
                                        </button>
                                    </div>

                                    <p className="text-muted">Forgot password?</p>
                                    <p style={{ borderTop: "1px solid var(--bs-body-color)", marginBottom: "0.5rem", paddingTop: "1rem" }}>Wanna start a new journey with <strong>DSOJ</strong>?</p><button className="btn btn-primary d-block w-100" type="submit" style={{ background: "#4CAF50", border: 0 }}>Sign up</button>
                                    <br />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}