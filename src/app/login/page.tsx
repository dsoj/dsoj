import { Metadata } from 'next';
import Login from './Login';
import { Suspense } from 'react';
export const metadata: Metadata = {
    title: 'Login',
    description: 'Begin your journey with DSOJ.',
};

export default function LoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Login />
        </Suspense>
    );
}