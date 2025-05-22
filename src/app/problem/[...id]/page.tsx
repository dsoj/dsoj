import EnvVars from '@/constant/EnvVars';
import ProblemDetail from './ProblemDetail';
import { IProblem } from '@/interface/IProblem';

export async function generateMetadata({ params }: { params: Promise<{ id: string[]; }>; }) {
    const id = (await params).id[0];
    const res = await fetch(`${EnvVars.host_url}/api/problem/${id}?simple=1`)
        .then((res) => res.json());

    const problemDetail: IProblem = res.data.problemDetail;

    return {
        title: `${id}. ${problemDetail.title}`,
        description: problemDetail.details,
    };
}

export default async function ProblemDetailPage({ params }: { params: Promise<{ id: string[]; }>; }) {
    const id = (await params).id[0];
    return (
        <ProblemDetail problem_id={id ?? ''} />
    );
}