import EnvVars from "@/constants/EnvVars";
import client from "@/lib/db";
import axios from "axios";
import { getCookie } from "cookies-next";
import { Base64 } from "js-base64";

const url = EnvVars.judge0.host + "/submissions/batch?base64_encoded=true";
export default async function SubmitApiHandler(req: any, res: any) {

    if (req.method !== "POST") return res.status(404);

    const { id, code, language_id } = req.body;

    try {
        const problemDetail = await client.db("Judge")
            .collection("Problems")
            .findOne({ id: id }, { projection: { _id: 0, id: 1, title: 1 } })
            .catch((err: any) => {
                console.error(err);
                return [];
            });

        const tasks = await client.db('Tasks')
            .collection(problemDetail.id)
            .find({}, { projection: { _id: 0 } })
            .toArray()

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
        const { data } = await axios.post(url, {
            submissions,
            callback_url: EnvVars.judge0.callback_url,
        });
        const username = getCookie("username", { req });

        client.db('Judge').collection('Submissions').insertOne({
            submission_id: `${username}-${id}-${new Date().getTime()}`,
            username: username,
            problem_id: id,
            submissions: data,
            code: code,
            send_time: new Date().toString(),
            language_id: language_id,
        })

        client.db('Judge').collection('Problems').updateOne({ id: id }, {
            $inc: { "submissions": 1 }
        });

        return res.status(200).send({ message: "Submit successful" });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: "Internal Server Error" });
    }
}