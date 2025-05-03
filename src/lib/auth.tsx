"use client"
import axios from "axios"

export async function authentication() {
    try {
        const response = await axios.get(`/api/auth/session`);
        return response.data;
    } catch (err) {
        console.error(err);
        return { session: false };
    }
}
