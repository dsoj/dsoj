import { Metadata } from 'next';
import Login from './Login';
export const metadata: Metadata = {
    title: 'Login',
    description: 'Begin your journey with DSOJ.',
};

export default function LoginPage() {
    return (
        <Login />
    );
}