import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
 

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Compares two objects and returns an object containing the differences.
 *
 * @param originalData - The original object to compare.
 * @param updatedData - The updated object to compare against.
 * @returns An object containing only the fields that have changed.
 */
export function compareData<T extends Record<string, unknown>>(
  originalData: T,
  updatedData: Partial<T>
): Partial<T> {
  const changes: Partial<T> = {};

  Object.keys(originalData).forEach((key) => {
    if (originalData[key] !== updatedData[key]) {
      changes[key as keyof T] = updatedData[key];
    }
  });

  return changes;
}
