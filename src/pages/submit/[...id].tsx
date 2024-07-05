import Layout from '@/components/Layout';
import { IProblemListItem } from '@/interface/IProblem';
import client from '@/lib/db';
import { send } from 'process';
// import { MongoClient } from 'mongodb';

import { useState } from "react";

// TODO: fix Module not found: Can't resolve 'child_process'
export default function ProblemDetail(problemDetail: IProblemListItem) { //TODO: add problemDetail's Interface
    const { id, title } = problemDetail;
    const [code, setCode] = useState("")
    const [language_id, setLanguage_id] = useState(71)
    const [message, setMessage] = useState("")

    async function submit() {
        if (code === "") {
            setMessage("Please enter code")
            return
        }

        // TODO: fix this
        const tasks = await client.db('Task').collection(id.toString()).find({}).toArray()
        let submissions = []

        for (let task of tasks) {
            const { stdin, stdout, cpu_time_limit } = task;
            const judgeRequest = {
                "submissions": [
                    {
                        "stdin": stdin,
                        "language_id": language_id,
                        "source_code": code,
                        "expected_output": stdout,
                        "cpu_time_limit": cpu_time_limit
                    }
                ]
            };

            fetch("http://localhost:2358/submissions/batch?wait=false", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: judgeRequest as unknown as BodyInit,
            })
            .then((res: any) => {
                submissions.push(res.token)
                
                if (submissions.length === tasks.length) {
                    client.db('Judge').collection('Submissions').insertOne({ 
                        user_id: "user_id_should_be_here",
                        problem_id: id,
                        submissions: submissions,
                        send_time: new Date(),
                        language_id: language_id,
                    })
                }
            })
            .catch((err: any) => {
                console.error(err);
            });
        }

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

    let problemDetail = (await client.db("Judge")
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
