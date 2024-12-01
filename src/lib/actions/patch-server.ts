'use server';
import { BASE_URL } from "../utils";
import { revalidatePath } from "next/cache";

interface UpdateResponse {
  success?: string;
  error?: string;
  data?: any;
}


export async function handleUpdateInServer(
  END_POINT: string,
  formData: Record<string, any>,
  path: string
): Promise<UpdateResponse> {
 

  try {
    const response = await fetch(`${BASE_URL}${END_POINT}`, {
      method:"PATCH",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    let data: any = {};
    if (response.headers.get("content-type")?.includes("application/json")) {
      data = await response.json();
    } else {
      console.warn("Response is not JSON. Response text:", await response.text());
    }

    if (response.ok) {
      // Revalidate path to update the cache
      revalidatePath(path);
      return {
        success: "Item updated successfully",
        data,
      };
    }

    if (response.status === 403) {
      return {
        error: data.detail || "You are not authorized to perform this action",
      };
    }

    return {
      error: data.detail || "Something went wrong",
    };
  } catch (error: any) {
    console.error("Error in handleUpdateInServer:", error);
    return {
      error: error.message || "Something went wrong. Please try again later.",
    };
  }
}
