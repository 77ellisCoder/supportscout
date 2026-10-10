import test from "node:test";
import assert from "node:assert/strict";

import { expectOk, getApiErrorMessage } from "./api";

test("getApiErrorMessage returns fallback for empty or invalid payloads", async () => {
  const response = new Response(JSON.stringify({}), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  });

  assert.equal(
    await getApiErrorMessage(response, "fallback"),
    "fallback"
  );
});

test("getApiErrorMessage reads the error field", async () => {
  const response = new Response(
    JSON.stringify({ error: "  Invalid credentials  " }),
    {
      status: 400,
      headers: { "Content-Type": "application/json" },
    }
  );

  assert.equal(
    await getApiErrorMessage(response, "fallback"),
    "Invalid credentials"
  );
});

test("getApiErrorMessage reads the message field", async () => {
  const response = new Response(
    JSON.stringify({ message: "  Auth failed  " }),
    {
      status: 400,
      headers: { "Content-Type": "application/json" },
    }
  );

  assert.equal(
    await getApiErrorMessage(response, "fallback"),
    "Auth failed"
  );
});

test("expectOk resolves for successful responses", async () => {
  const response = new Response(null, { status: 200 });

  await assert.doesNotReject(() => expectOk(response, "fallback"));
});

test("expectOk rejects with a normalized backend error message", async () => {
  const response = new Response(
    JSON.stringify({ message: "  Bad request  " }),
    {
      status: 400,
      headers: { "Content-Type": "application/json" },
    }
  );

  await assert.rejects(() => expectOk(response, "fallback"), {
    message: "Bad request",
  });
});
