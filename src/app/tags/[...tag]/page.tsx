import ProblemList from './ProblemList';

export async function generateMetadata({ params }: { params: Promise<{ tag: string[]; }>; }) {
    const tag = (await params).tag[0];
    return {
        title: `Tag: ${tag}`,
        description: `List of problems tagged with ${tag} in DSOJ`,
    };
}

export default async function ProblemListByTagPage({ params }: { params: Promise<{ tag: string; }>; }) {
    const tag = (await params).tag[0];
    return (
        <ProblemList tag={tag} />
    );

}