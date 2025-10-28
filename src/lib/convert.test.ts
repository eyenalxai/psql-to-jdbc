import { describe, expect, it } from "vitest"
import { convertToJdbcUrl } from "@/lib/convert"

describe("convertToJdbcUrl", () => {
	it("should convert a basic PostgreSQL URL to JDBC format", () => {
		const result = convertToJdbcUrl(
			"postgresql://user:pass@localhost:5432/mydb"
		).match(
			(value) => value,
			(error) => error
		)
		expect(result).toBe(
			"jdbc:postgresql://localhost:5432/mydb?user=user&password=pass"
		)
	})

	it("should handle URLs without password", () => {
		const result = convertToJdbcUrl(
			"postgresql://user@localhost:5432/mydb"
		).match(
			(value) => value,
			(error) => error
		)
		expect(result).toBe("jdbc:postgresql://localhost:5432/mydb?user=user")
	})

	it("should use default port if not specified", () => {
		const result = convertToJdbcUrl(
			"postgresql://user:pass@localhost/mydb"
		).match(
			(value) => value,
			(error) => error
		)
		expect(result).toBe(
			"jdbc:postgresql://localhost:5432/mydb?user=user&password=pass"
		)
	})

	it("should properly encode special characters in username and password", () => {
		const result = convertToJdbcUrl(
			"postgresql://user@name:pass%20word@localhost:5432/mydb"
		).match(
			(value) => value,
			(error) => error
		)
		expect(result).toBe(
			"jdbc:postgresql://localhost:5432/mydb?user=user%40name&password=pass%20word"
		)
	})

	describe("error cases", () => {
		it("should return error for empty URL", () => {
			const error = convertToJdbcUrl("").match(
				(value) => value,
				(error) => error
			)
			expect(error).toBe("URL must be a non-empty string")
		})

		it("should return error for invalid protocol", () => {
			const error = convertToJdbcUrl(
				"mysql://user:pass@localhost:5432/mydb"
			).match(
				(value) => value,
				(error) => error
			)
			expect(error).toBe("Invalid protocol: URL must start with postgresql://")
		})

		it("should return error for missing hostname", () => {
			const error = convertToJdbcUrl("postgresql://user:pass@/mydb").match(
				(value) => value,
				(error) => error
			)
			expect(error).toBe("Hostname is required")
		})

		it("should return error for missing database", () => {
			const error = convertToJdbcUrl(
				"postgresql://user:pass@localhost:5432"
			).match(
				(value) => value,
				(error) => error
			)
			expect(error).toBe("Database name is required")
		})

		it("should return error for missing username", () => {
			const error = convertToJdbcUrl(
				"postgresql://:pass@localhost:5432/mydb"
			).match(
				(value) => value,
				(error) => error
			)
			expect(error).toBe("Username is required")
		})

		it("should return error for invalid URL format", () => {
			const error = convertToJdbcUrl("not-a-url").match(
				(value) => value,
				(error) => error
			)
			expect(error).toContain("Invalid URL")
		})
	})
})
