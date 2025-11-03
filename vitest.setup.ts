import { readFileSync } from "fs";
import { join } from "path";
import { vi } from "vitest";

// Mock fetch to return words.json for tests
const words = JSON.parse(readFileSync(join(__dirname, "public", "words.json"), "utf-8"));

global.fetch = vi.fn((url: string | URL | Request) => {
  const urlString = typeof url === "string" ? url : url.toString();
  if (urlString === "/words.json") {
    return Promise.resolve({
      json: () => Promise.resolve(words),
    } as Response);
  }
  return Promise.reject(new Error(`Unknown URL: ${urlString}`));
}) as typeof fetch;
