import { convertToJdbcUrl } from "@/lib/convert"
import { describe, expect, it } from "vitest"

describe("convertToJdbcUrl", () => {
	it("should convert a valid PostgreSQL URL to JDBC URL", () => {
		const postgresUrl = "postgresql://user123:pass456@localhost:5432/mydb"
		const expectedJdbcUrl =
			"jdbc:postgresql://localhost:5432/mydb?user=user123&password=pass456"

		const result = convertToJdbcUrl(postgresUrl)
		expect(result.isOk()).toBe(true)
		expect(result._unsafeUnwrap()).toBe(expectedJdbcUrl)
	})

	it("should handle special characters in username and password", () => {
		const postgresUrl = "postgresql://user@123:pass@456@example.com:5432/mydb"
		const expectedJdbcUrl =
			"jdbc:postgresql://example.com:5432/mydb?user=user@123&password=pass@456"

		const result = convertToJdbcUrl(postgresUrl)
		expect(result.isOk()).toBe(true)
		expect(result._unsafeUnwrap()).toBe(expectedJdbcUrl)
	})

	it("should return error for invalid PostgreSQL URL format", () => {
		const invalidUrl = "invalid://user:pass@localhost:5432/mydb"

		const result = convertToJdbcUrl(invalidUrl)
		expect(result.isErr()).toBe(true)
		expect(result._unsafeUnwrapErr()).toBe("Invalid PostgreSQL URL format")
	})

	it("should handle different hostnames and ports", () => {
		const postgresUrl = "postgresql://admin:secret@db.example.com:1234/proddb"
		const expectedJdbcUrl =
			"jdbc:postgresql://db.example.com:1234/proddb?user=admin&password=secret"

		const result = convertToJdbcUrl(postgresUrl)
		expect(result.isOk()).toBe(true)
		expect(result._unsafeUnwrap()).toBe(expectedJdbcUrl)
	})
})
