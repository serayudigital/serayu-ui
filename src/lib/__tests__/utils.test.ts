import { describe, expect, it } from "vitest";
import {
  formatRupiah,
  formatTanggal,
  formatNomorHP,
  formatPhoneNumber,
  formatBytes,
  formatCompactNumber,
  isValidEmail,
  isValidURL,
  isValidIndonesianPhone,
  isValidNIK,
} from "../utils";

describe("formatRupiah", () => {
  it("formats integer as IDR without decimals", () => {
    const result = formatRupiah(15000);
    expect(result).toContain("15.000");
    expect(result).toContain("Rp");
  });

  it("formats 0", () => {
    const result = formatRupiah(0);
    expect(result).toContain("0");
    expect(result).toContain("Rp");
  });

  it("formats large numbers", () => {
    const result = formatRupiah(1500000000);
    expect(result).toContain("1.500.000.000");
    expect(result).toContain("Rp");
  });

  it("formats negative numbers", () => {
    const result = formatRupiah(-5000);
    expect(result).toContain("5.000");
  });

  it("accepts custom options (decimals)", () => {
    const result = formatRupiah(15000.5, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    expect(result).toContain("15.000,50");
  });
});

describe("formatTanggal", () => {
  it("formats Date with long month name", () => {
    // new Date(2026, 8, 24) = 24 September 2026 (month is 0-indexed).
    expect(formatTanggal(new Date(2026, 8, 24))).toBe("24 September 2026");
  });

  it("accepts Date object directly", () => {
    expect(formatTanggal(new Date(2026, 0, 1))).toBe("1 Januari 2026");
  });

  it("accepts number timestamp", () => {
    const ts = new Date(2026, 0, 5).getTime();
    expect(formatTanggal(ts)).toBe("5 Januari 2026");
  });

  it("accepts custom options (numeric month)", () => {
    expect(
      formatTanggal(new Date(2026, 8, 24), {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    ).toBe("24/09/2026");
  });
});

describe("formatNomorHP", () => {
  it("normalizes 08xx to +62", () => {
    expect(formatNomorHP("081234567890")).toBe("+6281234567890");
  });

  it("consistent for +62xx", () => {
    expect(formatNomorHP("+6281234567890")).toBe("+6281234567890");
  });

  it("consistent for 62xx", () => {
    expect(formatNomorHP("6281234567890")).toBe("+6281234567890");
  });

  it("strips spaces", () => {
    expect(formatNomorHP("0812 3456 7890")).toBe("+6281234567890");
  });

  it("strips hyphens", () => {
    expect(formatNomorHP("0812-3456-7890")).toBe("+6281234567890");
  });

  it("returns null for too-short input", () => {
    expect(formatNomorHP("08123")).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(formatNomorHP("")).toBeNull();
  });

  it("returns null for non-numeric text", () => {
    expect(formatNomorHP("hello")).toBeNull();
  });

  it("returns null for unknown prefix", () => {
    expect(formatNomorHP("181234567890")).toBeNull();
  });

  it("returns null for non-string input", () => {
    expect(formatNomorHP(undefined as unknown as string)).toBeNull();
    expect(formatNomorHP(null as unknown as string)).toBeNull();
    expect(formatNomorHP(123 as unknown as string)).toBeNull();
  });
});

describe("formatPhoneNumber", () => {
  it("default international format with hyphens", () => {
    expect(formatPhoneNumber("081234567890")).toBe("+62 812-3456-7890");
  });

  it("normalizes from +62xx format", () => {
    expect(formatPhoneNumber("+6281234567890")).toBe("+62 812-3456-7890");
  });

  it("normalizes from 62xx format without +", () => {
    expect(formatPhoneNumber("6281234567890")).toBe("+62 812-3456-7890");
  });

  it("normalizes from format with spaces or hyphens", () => {
    expect(formatPhoneNumber("0812 3456 7890")).toBe("+62 812-3456-7890");
    expect(formatPhoneNumber("0812-3456-7890")).toBe("+62 812-3456-7890");
  });

  it("local format with 0 prefix", () => {
    expect(formatPhoneNumber("081234567890", { format: "local" })).toBe(
      "0812-3456-7890"
    );
  });

  it("local format with default hyphens", () => {
    expect(formatPhoneNumber("+6281234567890", { format: "local" })).toBe(
      "0812-3456-7890"
    );
  });

  it("custom separator (space)", () => {
    expect(
      formatPhoneNumber("081234567890", { separator: " " })
    ).toBe("+62 812 3456 7890");
    expect(
      formatPhoneNumber("081234567890", { format: "local", separator: " " })
    ).toBe("0812 3456 7890");
  });

  it("custom separator (period)", () => {
    expect(formatPhoneNumber("081234567890", { separator: "." })).toBe(
      "+62 812.3456.7890"
    );
  });

  it("returns null for invalid input", () => {
    expect(formatPhoneNumber("")).toBeNull();
    expect(formatPhoneNumber("abc")).toBeNull();
    expect(formatPhoneNumber("08123")).toBeNull();
    expect(formatPhoneNumber("181234567890")).toBeNull();
  });

  it("returns null for non-string input", () => {
    expect(formatPhoneNumber(undefined as unknown as string)).toBeNull();
    expect(formatPhoneNumber(null as unknown as string)).toBeNull();
    expect(formatPhoneNumber(123 as unknown as string)).toBeNull();
  });
});

describe("isValidIndonesianPhone", () => {
  it("accepts 08xx", () => {
    expect(isValidIndonesianPhone("081234567890")).toBe(true);
  });

  it("accepts +62xx", () => {
    expect(isValidIndonesianPhone("+6281234567890")).toBe(true);
  });

  it("accepts 62xx", () => {
    expect(isValidIndonesianPhone("6281234567890")).toBe(true);
  });

  it("accepts with spaces or hyphens", () => {
    expect(isValidIndonesianPhone("0812-3456-7890")).toBe(true);
    expect(isValidIndonesianPhone("0812 3456 7890")).toBe(true);
  });

  it("rejects too short", () => {
    expect(isValidIndonesianPhone("08123")).toBe(false);
  });

  it("rejects too long (more than 13 digits after prefix)", () => {
    expect(isValidIndonesianPhone("08123456789012345")).toBe(false);
  });

  it("rejects empty string", () => {
    expect(isValidIndonesianPhone("")).toBe(false);
  });

  it("rejects text", () => {
    expect(isValidIndonesianPhone("abc")).toBe(false);
  });
});

describe("isValidEmail", () => {
  it("accepts standard email", () => {
    expect(isValidEmail("user@example.com")).toBe(true);
  });

  it("accepts subdomain", () => {
    expect(isValidEmail("user@mail.example.co.id")).toBe(true);
  });

  it("accepts plus tag", () => {
    expect(isValidEmail("user.name+tag@example.com")).toBe(true);
  });

  it("rejects empty string", () => {
    expect(isValidEmail("")).toBe(false);
  });

  it("rejects without @", () => {
    expect(isValidEmail("plaintext")).toBe(false);
  });

  it("rejects without domain", () => {
    expect(isValidEmail("user@")).toBe(false);
  });

  it("rejects without local part", () => {
    expect(isValidEmail("@example.com")).toBe(false);
  });

  it("rejects with spaces", () => {
    expect(isValidEmail("us er@example.com")).toBe(false);
  });

  it("rejects strings longer than 254 characters", () => {
    const longLocal = "a".repeat(250);
    const email = `${longLocal}@example.com`;
    expect(isValidEmail(email)).toBe(false);
  });

  it("rejects two consecutive dots in domain", () => {
    expect(isValidEmail("user@example..com")).toBe(false);
  });
});

describe("isValidNIK", () => {
  it("accepts valid male NIK", () => {
    // PPKKCC=317501 (DKI Jakarta), DDMMYY=150500 (15 May 2000), serial=0001
    expect(isValidNIK("3175011505000001")).toBe(true);
  });

  it("accepts female NIK (day encoded +40)", () => {
    // Date of birth 5 May 2000, written as 450500 (day=45).
    expect(isValidNIK("3175014505000001")).toBe(true);
  });

  it("rejects too short", () => {
    expect(isValidNIK("317501150500000")).toBe(false);
  });

  it("rejects too long", () => {
    expect(isValidNIK("31750115050000011")).toBe(false);
  });

  it("rejects non-digit content", () => {
    expect(isValidNIK("317501150500000X")).toBe(false);
    expect(isValidNIK("31750A1505000001")).toBe(false);
  });

  it("rejects month 00", () => {
    expect(isValidNIK("3175011500000001")).toBe(false);
  });

  it("rejects month 13", () => {
    expect(isValidNIK("3175011513000001")).toBe(false);
  });

  it("rejects day 00 (male)", () => {
    expect(isValidNIK("3175010005000001")).toBe(false);
  });

  it("rejects Feb 30 (rollover)", () => {
    expect(isValidNIK("3175013002000001")).toBe(false);
  });

  it("rejects empty string", () => {
    expect(isValidNIK("")).toBe(false);
  });

  it("rejects non-string input", () => {
    expect(isValidNIK(undefined as unknown as string)).toBe(false);
    expect(isValidNIK(1234567890123456 as unknown as string)).toBe(false);
  });
});

describe("formatBytes", () => {
  it("returns 0 B for 0", () => {
    expect(formatBytes(0)).toContain("0");
    expect(formatBytes(0)).toContain("B");
  });

  it("formats 1024 as 1 KB", () => {
    const result = formatBytes(1024);
    expect(result).toContain("1");
    expect(result).toContain("KB");
  });

  it("formats 1536 with one decimal", () => {
    const result = formatBytes(1536);
    expect(result).toContain("1,5");
    expect(result).toContain("KB");
  });

  it("formats 1048576 as 1 MB", () => {
    const result = formatBytes(1048576);
    expect(result).toContain("1");
    expect(result).toContain("MB");
  });

  it("formats 1073741824 as ~1 GB", () => {
    const result = formatBytes(1073741824);
    expect(result).toContain("GB");
  });

  it("honors en-US locale", () => {
    const result = formatBytes(1536, { locale: "en-US" });
    expect(result).toContain("1.5");
    expect(result).toContain("KB");
  });

  it("honors decimals option", () => {
    const result = formatBytes(1536, { decimals: 0 });
    expect(result).toContain("2");
    expect(result).toContain("KB");
  });

  it("handles negative bytes", () => {
    const result = formatBytes(-1024);
    expect(result.startsWith("-")).toBe(true);
  });

  it("returns 0 B for non-finite values", () => {
    expect(formatBytes(NaN)).toBe("0 B");
    expect(formatBytes(Infinity)).toBe("0 B");
  });
});

describe("formatCompactNumber", () => {
  it("formats 1200 compactly (id-ID)", () => {
    expect(formatCompactNumber(1200)).toContain("1,2");
  });

  it("formats 3_400_000 compactly (id-ID)", () => {
    expect(formatCompactNumber(3_400_000)).toContain("3,4");
  });

  it("formats 1_500_000_000 compactly (id-ID)", () => {
    expect(formatCompactNumber(1_500_000_000)).toContain("1,5");
  });

  it("honors en-US locale", () => {
    const result = formatCompactNumber(1500000000, { locale: "en-US" });
    expect(result).toBe("1.5B");
  });

  it("formats small numbers without compact notation", () => {
    expect(formatCompactNumber(500)).toContain("500");
  });

  it("accepts custom maximumFractionDigits", () => {
    const result = formatCompactNumber(1234567, {
      locale: "en-US",
      maximumFractionDigits: 0,
    });
    expect(result).toBe("1M");
  });
});

describe("isValidURL", () => {
  it("accepts https URL", () => {
    expect(isValidURL("https://example.com")).toBe(true);
  });

  it("accepts http URL", () => {
    expect(isValidURL("http://example.com/path?query=1#hash")).toBe(true);
  });

  it("rejects domain without protocol", () => {
    expect(isValidURL("example.com")).toBe(false);
  });

  it("rejects empty string", () => {
    expect(isValidURL("")).toBe(false);
  });

  it("rejects whitespace-only string", () => {
    expect(isValidURL("   ")).toBe(false);
  });

  it("rejects malformed URL", () => {
    expect(isValidURL("not a url")).toBe(false);
  });

  it("rejects ftp:// by default", () => {
    expect(isValidURL("ftp://files.example.com")).toBe(false);
  });

  it("accepts ftp:// when explicitly allowed", () => {
    expect(
      isValidURL("ftp://files.example.com", { protocols: ["ftp"] })
    ).toBe(true);
  });

  it("accepts mixed protocols list", () => {
    expect(
      isValidURL("ftp://files.example.com", {
        protocols: ["http", "https", "ftp"],
      })
    ).toBe(true);
  });

  it("rejects non-string input", () => {
    expect(isValidURL(undefined as unknown as string)).toBe(false);
    expect(isValidURL(null as unknown as string)).toBe(false);
    expect(isValidURL(42 as unknown as string)).toBe(false);
  });
});
