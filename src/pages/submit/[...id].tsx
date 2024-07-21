import Layout from '@/components/Layout';
import apiUrl from '@/constants/apiUrl';
import ErrorPage from 'next/error';
import client from '@/lib/db';


import { useState } from "react";
import { IProblem } from '@/interface/IProblem';

export default function ProblemDetail({ problemDetail }: any ){
    if (!problemDetail) {
        return (
            <ErrorPage statusCode={404} />
        )
    }

    const { id, title } = problemDetail;
    const [code, setCode] = useState("");
    const [language_id, setLanguage_id] = useState(71);
    const [message, setMessage] = useState("");

    const submit_api_url = apiUrl.judge0.submit;

    async function submit() {
        if (code === "") {
            setMessage("Please enter code")
            return
        }

        fetch(submit_api_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: id,
                    code: code,
                    language_id: language_id,
                }) as unknown as BodyInit,
            }
        )
    }

    return (
        // TODO: convert into formal page elements
        <Layout>
            <div>
                <p style={{ color: "red" }}>{message}</p>
                <h1>{id}. {title}</h1>
                <textarea onChange={(e) => setCode(e.target.value)} value={code}></textarea>
                <select value={language_id} onChange={(e) => setLanguage_id(parseInt(e.target.value))}>
                    <option value="71" defaultChecked>C++</option>
                    <option value="63">Python3</option>
                </select>
                <button onClick={submit}>Submit</button>
            </div>
        </Layout>

    )
}

export async function getServerSideProps(context: any) {
    const id = context.query.id[0];

    const problemDetail = (await client.db("Judge")
        .collection("Problems")
        .findOne({ id: id }, { projection: { _id: 0, id: 1, title: 1 } })
        .catch((err: any) => {
            console.error(err);
            return [];
        }))

    return {
        props: {
            problemDetail,
        },
    };
}
