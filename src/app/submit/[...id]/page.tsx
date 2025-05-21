import envVars from '@/constant/EnvVars';
import Submit from './Submit';
import { IProblem } from '@/interface/IProblem';

export async function generateMetadata({ params }: { params: Promise<{ id: string[]; }>; }) {
    const id = (await params).id[0];
    const res = await fetch(`${envVars.host_url}/api/problem/${id}?simple=1`)
        .then((res) => res.json());

    const problemDetail: IProblem = res.data.problemDetail;
    return {
        title: `Submit - ${id}. ${problemDetail.title}`,
        description: problemDetail.details,
    };
}

export default async function SubmitPage({ params }: { params: Promise<{ id: string[]; }>; }) {
    const id = (await params).id[0];
    return (
        <Submit problem_id={id} />
    );
}