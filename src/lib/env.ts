const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
  throw new Error(
    "Missing ENV Variable ! please create .env with VITE_API_URL",
  );
}
export const env = {
  API_URL,
} as const;
