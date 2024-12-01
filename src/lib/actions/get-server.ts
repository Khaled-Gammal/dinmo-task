"use server";

import { BASE_URL } from "@/lib/utils";

/**
 * Fetches data from the server-side in a Next.js application.
 *
 * @param {string} End_Point - API endpoint to fetch data from.
 * @param {RequestInit} [ExtraMethod={}] - Additional fetch options such as cache control.
 * @param {boolean} [Authorization=true] - Whether to include Authorization headers.
 * @returns {Promise<any>} - The fetched data or redirects on failure.
 */

interface getDataParamsType {
  End_Point: string;
  ExtraMethod?: object;
}

export async function GetDataInServerSide<T>({
  End_Point,
  ExtraMethod }
  : getDataParamsType
): Promise<{ data: T | null; message?: string, error: boolean }> {

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  }

  const response = await fetch(`${BASE_URL}${End_Point}`, {
    method: "GET",
    headers,
    cache: "no-store", // Avoid caching unless specified
    ...ExtraMethod, // Merge extra fetch options
  });

  if (response.ok) {
    const data = await response.json();
    return { data, error: false };
  } else {
    return { data: null, message: response.statusText, error: true };
  }
}
