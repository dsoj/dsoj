import ProblemList from './ProblemList';

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Problem List',
    description: 'List of problems available on DSOJ.',
};

export default function ProblemListPage() {
    return (
        <ProblemList />
    );
}
