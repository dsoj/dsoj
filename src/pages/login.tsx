import Image from 'next/image';
import logo from '@/assets/logo_s.png';
import Layout from '@/components/Layout';

import "bootstrap/dist/css/bootstrap.min.css";

export default function Login() {
    return (
        // TODO: Elements have to be convert to react-bootstrap components
        <div className="position-relative py-4 py-xl-5">
            <div className="container">
                <div className="row d-flex justify-content-center">
                    <div className="col-md-6 col-xl-4">
                        <div className="card mb-5">
                            <div className="card-body d-flex flex-column align-items-center">
                                <h2 style={{ marginBottom: '2rem' }}><Image src={logo.src} width={40} height={40} alt="logo" />&nbsp; Log in</h2>
                                <form className="text-center" method="post">
                                    <div className="mb-3"><input className="form-control" type="email" name="email" placeholder="Email" /></div>
                                    <div className="mb-3"><input className="form-control" type="password" name="password" placeholder="Password" /></div>
                                    <div className="mb-3"><button className="btn btn-primary d-block w-100" type="submit" style={{ marginTop: "2rem" }}>Login</button></div>
                                    <p className="text-muted">Forgot password?</p>
                                    <p style={{ borderTop: "1px solid var(--bs-body-color)", marginBottom: "0.5rem", paddingTop: "1rem" }}>Wanna start a new journey with <strong>DSOJ</strong>?</p><button className="btn btn-primary d-block w-100" type="submit" style={{ background: "#4CAF50", border: 0 }}>Sign up</button>
                                    <br />
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
