import EnvVars from "@/constants/EnvVars";
import client from "@/lib/db";
import axios from "axios";
import { getCookie } from "cookies-next";

const url = EnvVars.judge0.host + "/submissions/batch";
export default async function SubmitApiHandler(req: any, res: any) {
    if (req.method !== "POST") return res.status(404);

    const { id, code, language_id } = req.body;

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
            "source_code": code,
            "stdin": stdin,
            "expected_output": stdout,
            "cpu_time_limit": cpu_time_limit,
        });
    };

    const { data } = await axios.post(url, { submissions });
    const username = getCookie("username", { req });  

    client.db('Judge').collection('Submissions').insertOne({
        username: username,  // TODO: user_id_should_be_here
        problem_id: id,
        submissions: data,
        code: code,
        send_time: new Date(),
        language_id: language_id,
    })

    return res.status(200).send({ message: "Submit successful" });
}