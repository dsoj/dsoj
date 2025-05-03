import EnvVars from "@/constant/EnvVars";
import { ApiResponse } from '@/lib/ApiUtils';
import { connectMongoClient } from '@/lib/db';
import { Base64 } from 'js-base64';
import { NextRequest } from 'next/server';

const url = EnvVars.judge0.host + "/submissions/batch?base64_encoded=true";

export async function POST(req: NextRequest) {
    const { problem_id, code, language_id } = await req.json();

    try {
        // Check if the requested problem is valid
        const client = await connectMongoClient();
        const problemDetail = await client.db("Judge")
            .collection("Problems")
            .findOne({ id: problem_id }, { projection: { _id: 0, id: 1, title: 1 } });

        if (!problemDetail) {
            return ApiResponse('Problem not found', false);
        }

        // Get tasks of the problem
        const tasks = await client.db('Tasks')
            .collection(problemDetail.id)
            .find({}, { projection: { stdin: 1, stdout: 1, cpu_time_limit: 1 } })
            .toArray();

        let submissions = [];
        for (let task of tasks) {
            const { stdin, stdout, cpu_time_limit } = task;
            submissions.push({
                "language_id": language_id,
                "source_code": Base64.encode(code),
                "stdin": Base64.encode(stdin),
                "expected_output": Base64.encode(stdout),
                "cpu_time_limit": cpu_time_limit,
                "callback_url": EnvVars.judge0.callback_url,
            });
        };

        // submit to judge0
        const r = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                submissions,
                callback_url: EnvVars.judge0.callback_url,
            }),
        });
        const data = await r.json();

        const username = await req.cookies.get('username');

        client.db('Judge').collection('Submissions').insertOne({
            submission_id: `${username}-${problemDetail}-${new Date().getTime()}`,
            username: username,
            problem_id: problem_id,
            submissions: data,
            code: code,
            send_time: new Date().toString(),
            language_id: language_id,
        });

        client.db('Judge').collection('Problems').updateOne({ id: problem_id }, {
            $inc: { "submissions": 1 }
        }).then(() => {
            client.close();
        });

        return ApiResponse('Submit successful', true);
    } catch (err) {
        console.error(err);
        return ApiResponse('Internal Server Error', false);
    }
}
