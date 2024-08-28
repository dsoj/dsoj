import client from "@/lib/db";
import { Base64 } from "js-base64";

export default async function CallbackApiHandler(req: any, res: any) {
    if(req.method !== "PUT") return res.status(404);
    
    const { stdout, time, memory, stderr, token, compile_output, message, status } = req.body;

    // TODO: update the submission status
    client.db("Judge").collection("Submissions").updateOne({ "submissions.token": token }, {
        $set: {
            "submissions.$.token": token,
            "submissions.$.stdout": (stdout ? Base64.decode(stdout) : ""),
            "submissions.$.time": time,
            "submissions.$.memory": memory,
            "submissions.$.stderr": (stderr ? Base64.decode(stderr) : ""),
            "submissions.$.compile_output": (compile_output ? Base64.decode(compile_output) : ""),
            "submissions.$.message": (message ? Base64.decode(message) : ""),
            "submissions.$.status": status.description,
        }
    }); 

    return res.status(200).send("OK");    
}