"use client"
import axios from "axios"

export async function authentication() {
    // TODO: url to be replaced with EnvVars #FRONTEND
    const response = await axios.get(`/api/auth/session`);
    return response.data;
}
