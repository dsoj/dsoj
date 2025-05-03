import ProblemList from './ProblemList';

export default async function ProblemListByTagPage({ params }: { params: Promise<{ tag: string; }>; }) {
    const tag = (await params).tag[0];
    return (
        <ProblemList tag={tag} />
    );

}