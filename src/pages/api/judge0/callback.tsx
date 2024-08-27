import client from "@/lib/db";

export default async function CallbackApiHandler(req: any, res: any) {
    if(req.method !== "PUT") return res.status(404);
    
    const { stdout, time, memory, stderr, token, compile_output, message, status } = req.body;

    // TODO: update the submission status
    client.db("Judge").collection("Submissions").updateOne({ "submissions.token": token }, {
        $set: {
            "submissions.$.stdout": stdout,
            "submissions.$.time": time,
            "submissions.$.memory": memory,
            "submissions.$.stderr": stderr,
            "submissions.$.compile_output": compile_output,
            "submissions.$.message": message,
            "submissions.$.status": status,
        }
    });

    console.log(token);

    return res.status(200);

    
}