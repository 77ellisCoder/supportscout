import test from "node:test";
import assert from "node:assert/strict";

import { getErrorMessage } from "./error";

test("getErrorMessage returns the provided fallback for unknown values", () => {
  assert.equal(getErrorMessage(undefined, "fallback"), "fallback");
  assert.equal(getErrorMessage(null, "fallback"), "fallback");
  assert.equal(getErrorMessage({}, "fallback"), "fallback");
});

test("getErrorMessage prefers an Error message", () => {
  assert.equal(
    getErrorMessage(new Error("  Boom  "), "fallback"),
    "Boom"
  );
});

test("getErrorMessage reads a backend error payload", () => {
  assert.equal(
    getErrorMessage({ error: "  Invalid credentials  " }, "fallback"),
    "Invalid credentials"
  );

  assert.equal(
    getErrorMessage({ message: "  Auth failed  " }, "fallback"),
    "Auth failed"
  );
});

test("getErrorMessage handles plain strings", () => {
  assert.equal(getErrorMessage("  Plain error  ", "fallback"), "Plain error");
});
