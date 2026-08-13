import { ApiResponse } from "../types";

export function normalizeListResponse<T>(resBody: any, keyName?: string): T[] {
  if (!resBody) return [];
  if (Array.isArray(resBody)) return resBody;
  if (Array.isArray(resBody.data)) return resBody.data;

  if (resBody.data && typeof resBody.data === "object") {
    if (keyName && Array.isArray(resBody.data[keyName])) {
      return resBody.data[keyName];
    }
    for (const key of Object.keys(resBody.data)) {
      if (Array.isArray(resBody.data[key])) {
        return resBody.data[key];
      }
    }
  }

  if (keyName && Array.isArray(resBody[keyName])) {
    return resBody[keyName];
  }

  for (const key of Object.keys(resBody)) {
    if (Array.isArray(resBody[key])) {
      return resBody[key];
    }
  }

  return [];
}

export function wrapNormalizedList<T>(resBody: any, keyName?: string): ApiResponse<T[]> {
  const list = normalizeListResponse<T>(resBody, keyName);
  return {
    success: resBody?.success ?? true,
    message: resBody?.message,
    data: list,
  };
}
