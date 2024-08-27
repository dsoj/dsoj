"use client"
import EnvVars from "@/constants/EnvVars"
import axios from "axios"

export async function authentication() {
    const response = await axios.get(`http://127.0.0.1:${EnvVars.Port}/api/auth/session`);
    return response.data.session;
}
