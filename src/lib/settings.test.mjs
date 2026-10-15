import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import {
  trimSettings,
  validateSettings,
  saveSettings,
  loadSettings,
  defaultSettings,
  SETTINGS_STORAGE_KEY,
} from "./settings.ts";

// Mock localStorage for Node.js test environment
const mockStorage = new Map();
const fakeLocalStorage = {
  getItem: (key) => mockStorage.get(key) ?? null,
  setItem: (key, value) => mockStorage.set(key, String(value)),
  removeItem: (key) => mockStorage.delete(key),
  clear: () => mockStorage.clear(),
};

// Polyfill window and localStorage in global scope for testing persistence
globalThis.window = globalThis;
globalThis.localStorage = fakeLocalStorage;

describe("User Settings Validation & Logic", () => {
  beforeEach(() => {
    fakeLocalStorage.clear();
  });

  describe("trimSettings helper", () => {
    it("removes leading and trailing whitespace from both Full Name and Email", () => {
      const trimmed = trimSettings({
        fullName: " Sanyul Islam ",
        email: " sanyul@example.com ",
      });

      assert.equal(trimmed.fullName, "Sanyul Islam");
      assert.equal(trimmed.email, "sanyul@example.com");
    });

    it("trims whitespace-only values to empty strings", () => {
      const trimmed = trimSettings({
        fullName: "   \t  ",
        email: "  \n  ",
      });

      assert.equal(trimmed.fullName, "");
      assert.equal(trimmed.email, "");
    });
  });

  describe("Valid submission", () => {
    it("returns no validation errors for valid name and email", () => {
      const result = validateSettings({
        fullName: "Taylor Swift",
        email: "taylor@example.com",
      });

      assert.equal(result.fullName, undefined);
      assert.equal(result.email, undefined);
      assert.equal(Object.keys(result).length, 0);
    });

    it("accepts valid email with subdomains and tags", () => {
      const result = validateSettings({
        fullName: "Taylor Swift",
        email: "taylor+notifications@mail.domain.co.uk",
      });

      assert.equal(result.fullName, undefined);
      assert.equal(result.email, undefined);
    });
  });

  describe("Required fields & Whitespace-only rejection", () => {
    it("fails when both fields are empty", () => {
      const result = validateSettings({
        fullName: "",
        email: "",
      });

      assert.equal(result.fullName, "Full name is required.");
      assert.equal(result.email, "Email is required.");
    });

    it("fails when fullName is empty but email is provided", () => {
      const result = validateSettings({
        fullName: "",
        email: "user@example.com",
      });

      assert.equal(result.fullName, "Full name is required.");
      assert.equal(result.email, undefined);
    });

    it("fails when email is empty but fullName is provided", () => {
      const result = validateSettings({
        fullName: "Jordan Lee",
        email: "",
      });

      assert.equal(result.fullName, undefined);
      assert.equal(result.email, "Email is required.");
    });

    it("rejects whitespace-only fullName with required error", () => {
      const result = validateSettings({
        fullName: "    \t   ",
        email: "valid@example.com",
      });

      assert.equal(result.fullName, "Full name is required.");
      assert.equal(result.email, undefined);
    });

    it("rejects whitespace-only email with required error", () => {
      const result = validateSettings({
        fullName: "Alex Morgan",
        email: "    \n   ",
      });

      assert.equal(result.fullName, undefined);
      assert.equal(result.email, "Email is required.");
    });

    it("rejects when both fields are whitespace-only", () => {
      const result = validateSettings({
        fullName: "   ",
        email: "   ",
      });

      assert.equal(result.fullName, "Full name is required.");
      assert.equal(result.email, "Email is required.");
    });
  });

  describe("Whitespace trimming with valid inputs", () => {
    it("correctly handles inputs with leading and trailing whitespace like ' Sanyul Islam ' and ' sanyul@example.com '", () => {
      const input = {
        fullName: " Sanyul Islam ",
        email: " sanyul@example.com ",
      };

      const result = validateSettings(input);
      assert.equal(result.fullName, undefined);
      assert.equal(result.email, undefined);
      assert.equal(Object.keys(result).length, 0);

      const trimmed = trimSettings(input);
      assert.equal(trimmed.fullName, "Sanyul Islam");
      assert.equal(trimmed.email, "sanyul@example.com");
    });

    it("validates successfully when fields have multiple tabs and spaces around valid content", () => {
      const result = validateSettings({
        fullName: "\t  Morgan Riley \t ",
        email: "  morgan@example.com  ",
      });

      assert.equal(result.fullName, undefined);
      assert.equal(result.email, undefined);
      assert.equal(Object.keys(result).length, 0);
    });
  });

  describe("Invalid email format", () => {
    it("rejects email missing '@' symbol", () => {
      const result = validateSettings({
        fullName: "Sam Patel",
        email: "sampatel.example.com",
      });

      assert.equal(result.fullName, undefined);
      assert.equal(result.email, "Please enter a valid email address.");
    });

    it("rejects email missing domain", () => {
      const result = validateSettings({
        fullName: "Sam Patel",
        email: "sam@",
      });

      assert.equal(result.email, "Please enter a valid email address.");
    });

    it("rejects email missing top-level domain", () => {
      const result = validateSettings({
        fullName: "Sam Patel",
        email: "sam@domain",
      });

      assert.equal(result.email, "Please enter a valid email address.");
    });

    it("rejects email with internal spaces", () => {
      const result = validateSettings({
        fullName: "Sam Patel",
        email: "sam @example.com",
      });

      assert.equal(result.email, "Please enter a valid email address.");
    });

    it("rejects email missing username", () => {
      const result = validateSettings({
        fullName: "Sam Patel",
        email: "@example.com",
      });

      assert.equal(result.email, "Please enter a valid email address.");
    });
  });

  describe("Persistence & Success flow trimming behavior", () => {
    it("persists trimmed values 'Sanyul Islam' and 'sanyul@example.com' on save", () => {
      saveSettings({
        fullName: " Sanyul Islam ",
        email: " sanyul@example.com ",
      });

      const raw = fakeLocalStorage.getItem(SETTINGS_STORAGE_KEY);
      assert.ok(raw);
      const parsed = JSON.parse(raw);
      assert.equal(parsed.fullName, "Sanyul Islam");
      assert.equal(parsed.email, "sanyul@example.com");
      assert.equal(parsed.theme, "system");
    });

    it("loads saved settings from storage", () => {
      fakeLocalStorage.setItem(
        SETTINGS_STORAGE_KEY,
        JSON.stringify({
          fullName: "Reese Avery",
          email: "reese@example.com",
        }),
      );

      const loaded = loadSettings();
      assert.equal(loaded.fullName, "Reese Avery");
      assert.equal(loaded.email, "reese@example.com");
      assert.equal(loaded.theme, "system");
    });

    it("falls back to default settings when storage is empty", () => {
      const loaded = loadSettings();
      assert.deepEqual(loaded, defaultSettings);
    });

    it("falls back to default settings when storage has corrupt JSON", () => {
      fakeLocalStorage.setItem(SETTINGS_STORAGE_KEY, "{corrupt-json");
      const loaded = loadSettings();
      assert.deepEqual(loaded, defaultSettings);
    });
  });
});
