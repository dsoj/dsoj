"use client"
import EnvVars from "@/constants/EnvVars"
import axios from "axios"

export async function authentication() {
    // TODO: url to be replaced with EnvVars #FRONTEND
    const response = await axios.get(`http://localhost:3000/api/auth/session`);
    return response.data;
}
