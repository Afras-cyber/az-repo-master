import assert from "node:assert/strict";
import test from "node:test";
import { parseRepositoryUrl } from "./github.js";

test("parseRepositoryUrl canonicalizes a public GitHub repository", () => {
  const repository = parseRepositoryUrl("https://github.com/Acme/Shop-API.git");

  assert.equal(repository.canonicalUrl, "https://github.com/Acme/Shop-API");
  assert.equal(repository.id, "https://github.com/acme/shop-api");
});

test("parseRepositoryUrl rejects non-GitHub and non-HTTPS URLs", () => {
  assert.throws(
    () => parseRepositoryUrl("http://github.com/acme/shop-api"),
    /public GitHub URL/,
  );
  assert.throws(
    () => parseRepositoryUrl("https://example.com/acme/shop-api"),
    /public GitHub URL/,
  );
});

test("parseRepositoryUrl rejects subpaths and malformed repository names", () => {
  assert.throws(
    () => parseRepositoryUrl("https://github.com/acme/shop-api/tree/main"),
    /public GitHub URL/,
  );
  assert.throws(
    () => parseRepositoryUrl("https://github.com/../repo"),
    /public GitHub URL/,
  );
});
