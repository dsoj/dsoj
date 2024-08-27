import Image from 'next/image';
import logo from '@/assets/logo_s.png';
import { useEffect, useState } from 'react';

import "bootstrap/dist/css/bootstrap.min.css";
import HeadComponent from '@/components/head';
import apiUrl from '@/constants/apiUrl';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { authentication } from '@/lib/auth';

export default function Login(req: any, res: any) {
    const router = useRouter();
    const url = apiUrl.accounts.login;
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isFetching, setIsFetching] = useState(true);

    (async () => {
        if(await authentication()==1) {
            setMessage("You are already logged in. Redirecting to home page...");
            router.push('/');
        }else{
            setIsFetching(false);
        }
    })();

    async function Login() {
        setIsFetching(true);
        await axios.post(
            url,
            JSON.stringify({
                name: name,
                password: password,
            }),
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        )
            .then((res: any) => {
                setMessage((res.data) ? res.data.message : '');
                if (res.data.session) {
                    router.push('/');

                } else {
                    setPassword('');
                    setIsFetching(false);
                }
            })
            .catch((err: any) => {
                console.error(err);
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
            <HeadComponent />
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
                                        <button className="btn btn-primary d-block w-100" type="button" disabled={isFetching} style={{ marginTop: "2rem" }} onClick={Login}>Login</button>
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