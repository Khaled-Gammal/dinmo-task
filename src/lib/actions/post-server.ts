"use server";

import { BASE_URL } from "../utils";
import { revalidatePath } from "next/cache";


interface PostInServerProps<T> {
    End_Point: string;
    bodyData: T;
    path: string;
}

/**
 * Handles server-side POST requests.
 *
 * @param {string} End_Point - API endpoint to send the POST request.
 * @param {Record<string, any>} data - Data to be sent in the request body.
 * @param {string} path - Path to revalidate after a successful request.
 * @param {string} [dataType="formData"] - Type of data being sent (e.g., "formData" or "json").
 * @returns {Promise<{success?: true or false, error?: true or false}>} - Response object with success, error, or data.
 */
export async function handlePostInServer<T>({
    End_Point,
    bodyData,
    path,
}: PostInServerProps<T>): Promise<{ success: boolean, error: boolean }> {

    const response = await fetch(`${BASE_URL}${End_Point}`, {
        method: "POST",
        body: JSON.stringify(bodyData),
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (response.ok) {
        revalidatePath(path);
        return { success: true, error: false };
    }
    return { success: false, error: true };
}
