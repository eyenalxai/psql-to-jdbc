import { describe, expect, it } from "vitest"
import { convertToJdbcUrl } from "@/lib/convert"

describe("convertToJdbcUrl", () => {
	it("should convert a basic PostgreSQL URL to JDBC format", () => {
		const result = convertToJdbcUrl(
			"postgresql://user:pass@localhost:5432/mydb"
		)
		expect(result.isOk()).toBe(true)
		expect(result._unsafeUnwrap()).toBe(
			"jdbc:postgresql://localhost:5432/mydb?user=user&password=pass"
		)
	})

	it("should handle URLs without password", () => {
		const result = convertToJdbcUrl("postgresql://user@localhost:5432/mydb")
		expect(result.isOk()).toBe(true)
		expect(result._unsafeUnwrap()).toBe(
			"jdbc:postgresql://localhost:5432/mydb?user=user"
		)
	})

	it("should use default port if not specified", () => {
		const result = convertToJdbcUrl("postgresql://user:pass@localhost/mydb")
		expect(result.isOk()).toBe(true)
		expect(result._unsafeUnwrap()).toBe(
			"jdbc:postgresql://localhost:5432/mydb?user=user&password=pass"
		)
	})

	it("should properly encode special characters in username and password", () => {
		const result = convertToJdbcUrl(
			"postgresql://user@name:pass%20word@localhost:5432/mydb"
		)
		expect(result.isOk()).toBe(true)
		expect(result._unsafeUnwrap()).toBe(
			"jdbc:postgresql://localhost:5432/mydb?user=user%40name&password=pass%20word"
		)
	})

	describe("error cases", () => {
		it("should return error for empty URL", () => {
			const result = convertToJdbcUrl("")
			expect(result.isErr()).toBe(true)
			expect(result._unsafeUnwrapErr()).toBe("URL must be a non-empty string")
		})

		it("should return error for invalid protocol", () => {
			const result = convertToJdbcUrl("mysql://user:pass@localhost:5432/mydb")
			expect(result.isErr()).toBe(true)
			expect(result._unsafeUnwrapErr()).toBe(
				"Invalid protocol: URL must start with postgresql://"
			)
		})

		it("should return error for missing hostname", () => {
			const result = convertToJdbcUrl("postgresql://user:pass@/mydb")
			expect(result.isErr()).toBe(true)
			expect(result._unsafeUnwrapErr()).toBe("Hostname is required")
		})

		it("should return error for missing database", () => {
			const result = convertToJdbcUrl("postgresql://user:pass@localhost:5432")
			expect(result.isErr()).toBe(true)
			expect(result._unsafeUnwrapErr()).toBe("Database name is required")
		})

		it("should return error for missing username", () => {
			const result = convertToJdbcUrl("postgresql://:pass@localhost:5432/mydb")
			expect(result.isErr()).toBe(true)
			expect(result._unsafeUnwrapErr()).toBe("Username is required")
		})

		it("should return error for invalid URL format", () => {
			const result = convertToJdbcUrl("not-a-url")
			expect(result.isErr()).toBe(true)
			expect(result._unsafeUnwrapErr()).toContain("Invalid URL")
		})
	})
})
