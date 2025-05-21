import { Metadata } from 'next';
import SignUp from "./Signup";

export const metadata: Metadata = {
    title: 'Sign Up',
    description: 'Join us on DSOJ.',
};

export default function SignUpPage() {
    return (
        <SignUp />
    );
}