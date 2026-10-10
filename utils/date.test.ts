import test from "node:test";
import assert from "node:assert/strict";

import {
    parseDateValue,
} from "./date";

test("parseDateValue accepts ISO date strings", () => {
    const value = parseDateValue("2025-03-07");

    assert.ok(value);
    assert.equal(value.getFullYear(), 2025);
    assert.equal(value.getMonth(), 2);
    assert.equal(value.getDate(), 7);
});

test("parseDateValue accepts ISO timestamps", () => {
    const value = parseDateValue("2025-03-07T12:30:00.000Z");

    assert.ok(value);
    assert.equal(value.getUTCFullYear(), 2025);
    assert.equal(value.getUTCMonth(), 2);
    assert.equal(value.getUTCDate(), 7);
});

test("parseDateValue rejects invalid values", () => {
    assert.equal(parseDateValue(""), null);
    assert.equal(parseDateValue(undefined), null);
    assert.equal(parseDateValue("not-a-date"), null);
});
