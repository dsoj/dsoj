import { ApiResponse } from '@/lib/ApiUtils';
import { connectMongoClient } from "@/lib/db";
import { Base64 } from "js-base64";
import { NextRequest } from 'next/server';

export async function PUT(req: NextRequest) {
    try {
        const client = await connectMongoClient();

        const { stdout, time, memory, stderr, token, compile_output, message, status } = await req.json();

        let update_data = {};
        if (status.description != "Accepted") {
            update_data = {
                "submissions.$.token": token,
                "submissions.$.stdout": (stdout ? Base64.decode(stdout) : ""),
                "submissions.$.time": time,
                "submissions.$.memory": memory,
                "submissions.$.stderr": (stderr ? Base64.decode(stderr) : ""),
                "submissions.$.compile_output": (compile_output ? Base64.decode(compile_output) : ""),
                "submissions.$.message": (message ? Base64.decode(message) : ""),
                "submissions.$.status": status.description,
                "status": "Failed"
            };
        } else {
            update_data = {
                "submissions.$.token": token,
                "submissions.$.stdout": (stdout ? Base64.decode(stdout) : ""),
                "submissions.$.time": time,
                "submissions.$.memory": memory,
                "submissions.$.stderr": (stderr ? Base64.decode(stderr) : ""),
                "submissions.$.compile_output": (compile_output ? Base64.decode(compile_output) : ""),
                "submissions.$.message": (message ? Base64.decode(message) : ""),
                "submissions.$.status": status.description,
            };
        }


        client.db("Judge").collection("Submissions").updateOne({ "submissions.token": token }, {
            $set: update_data
        });

        return ApiResponse("OK", true);
    } catch (err) {
        console.error(err);
        return ApiResponse("Error", false);
    }
}