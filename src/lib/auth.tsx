"use client"
import axios from "axios"

export async function authentication() {
    const response = await axios.get("http://127.0.0.1:3000/api/auth/session");
    return response.data.session;
}
