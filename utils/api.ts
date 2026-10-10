export type ApiErrorBody = {
  error?: string | null;
  message?: string | null;
};

export async function getApiErrorMessage(
  response: Response,
  fallback: string
): Promise<string> {
  try {
    const body = (await response.clone().json()) as ApiErrorBody | null;

    if (typeof body?.error === "string" && body.error.trim()) {
      return body.error.trim();
    }

    if (typeof body?.message === "string" && body.message.trim()) {
      return body.message.trim();
    }
  } catch {
    // Ignore JSON parsing problems and fall back to a stable message.
  }

  return fallback;
}

export async function expectOk(
  response: Response,
  fallback: string
): Promise<void> {
  if (response.ok) {
    return;
  }

  throw new Error(
    await getApiErrorMessage(response, fallback)
  );
}
