"use client"
import axios from "axios"

export async function authentication() {
    const response = await axios.get(`/api/auth/session`);
    return response.data;
}
