import Submit from './Submit';

export default async function SubmitPage({ params }: { params: Promise<{ id: string[]; }>; }) {
    const id = (await params).id[0];
    return (
        <Submit problem_id={id} />
    );
}