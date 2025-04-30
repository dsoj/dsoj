import ProblemDetail from './Detail';

export default async function ProblemDetailPage({ params }: { params: Promise<{ id: string[]; }>; }) {
    const id = (await params).id[0];
    return (
        <ProblemDetail problem_id={id ?? ''} />
    );
}