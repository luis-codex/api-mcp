import { z } from "zod";

export const listQuerySchema = z
  .object({
    page: z.number().int().optional(),
    per_page: z.number().int().optional(),
    search: z.string().optional(),
  })
  .optional();

export const buildQueryString = (
  params?: Record<string, string | number | boolean | null | undefined>
) => {
  if (!params) {
    return "";
  }

  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    searchParams.set(key, String(value));
  }
  return searchParams.toString();
};
