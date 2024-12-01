"use server";

import { BASE_URL } from "../utils";
import { revalidatePath } from "next/cache";


interface DeleteInServerProps {
  End_Point: string;
  path: string;
  id: string | number;
}

interface DeleteResponse {
  success: boolean;
  error: boolean;
}

export async function handleDeleteRow({
  End_Point,
  id,
  path,
}: DeleteInServerProps): Promise<DeleteResponse> {

  const response = await fetch(`${BASE_URL}${End_Point}${id}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    revalidatePath(path);
    return { success: true, error: false };
  } else {
    return { success: false, error: true };
  }
}
