import { describe, expect, it } from "vitest"
import { convertToJdbcUrl, ERROR_CODES, getErrorMessage } from "@/lib/convert"

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

	it("should handle empty password (colon present but no password)", () => {
		const result = convertToJdbcUrl(
			"postgresql://user:@localhost:5432/mydb"
		).match(
			(value) => value,
			(error) => error
		)
		expect(result).toBe("jdbc:postgresql://localhost:5432/mydb?user=user")
	})

	it("should handle IPv6 addresses", () => {
		const result = convertToJdbcUrl(
			"postgresql://user:pass@[::1]:5432/mydb"
		).match(
			(value) => value,
			(error) => error
		)
		expect(result).toBe(
			"jdbc:postgresql://[::1]:5432/mydb?user=user&password=pass"
		)
	})

	it("should preserve query parameters in PostgreSQL URL", () => {
		const result = convertToJdbcUrl(
			"postgresql://user:pass@localhost:5432/mydb?sslmode=require&connect_timeout=10"
		).match(
			(value) => value,
			(error) => error
		)
		expect(result).toBe(
			"jdbc:postgresql://localhost:5432/mydb?user=user&password=pass&sslmode=require&connect_timeout=10"
		)
	})

	it("should handle special characters in database name", () => {
		const result = convertToJdbcUrl(
			"postgresql://user:pass@localhost:5432/my-db_123"
		).match(
			(value) => value,
			(error) => error
		)
		expect(result).toBe(
			"jdbc:postgresql://localhost:5432/my-db_123?user=user&password=pass"
		)
	})

	it("should handle database name with URL-unsafe characters", () => {
		const result = convertToJdbcUrl(
			"postgresql://user:pass@localhost:5432/my%20database"
		).match(
			(value) => value,
			(error) => error
		)
		expect(result).toBe(
			"jdbc:postgresql://localhost:5432/my%20database?user=user&password=pass"
		)
	})

	it("should handle complex special characters in credentials", () => {
		const result = convertToJdbcUrl(
			"postgresql://user%3Dname:p%26ss%3Dw%40rd@localhost:5432/mydb"
		).match(
			(value) => value,
			(error) => error
		)
		expect(result).toBe(
			"jdbc:postgresql://localhost:5432/mydb?user=user%3Dname&password=p%26ss%3Dw%40rd"
		)
	})

	it("should accept postgres:// as alternative protocol", () => {
		const result = convertToJdbcUrl(
			"postgres://user:pass@localhost:5432/mydb"
		).match(
			(value) => value,
			(error) => error
		)
		expect(result).toBe(
			"jdbc:postgresql://localhost:5432/mydb?user=user&password=pass"
		)
	})

	it("should trim leading and trailing whitespace", () => {
		const result = convertToJdbcUrl(
			"  postgresql://user:pass@localhost:5432/mydb  "
		).match(
			(value) => value,
			(error) => error
		)
		expect(result).toBe(
			"jdbc:postgresql://localhost:5432/mydb?user=user&password=pass"
		)
	})

	describe("error cases", () => {
		it("should return error for empty URL", () => {
			convertToJdbcUrl("").mapErr((error) => {
				expect(error).toBe(ERROR_CODES.INVALID_INPUT)
				expect(getErrorMessage(error)).toBe("URL must be a non-empty string")
			})
		})

		it("should return error for invalid protocol", () => {
			convertToJdbcUrl("mysql://user:pass@localhost:5432/mydb").mapErr(
				(error) => {
					expect(error).toBe(ERROR_CODES.INVALID_PROTOCOL)
					expect(getErrorMessage(error)).toBe(
						"Invalid protocol: URL must start with either postgresql:// or postgres://"
					)
				}
			)
		})

		it("should return error for missing hostname", () => {
			convertToJdbcUrl("postgresql://user:pass@/mydb").mapErr((error) => {
				expect(error).toBe(ERROR_CODES.MISSING_HOSTNAME)
				expect(getErrorMessage(error)).toBe("Hostname is required")
			})
		})

		it("should return error for missing database", () => {
			convertToJdbcUrl("postgresql://user:pass@localhost:5432").mapErr(
				(error) => {
					expect(error).toBe(ERROR_CODES.MISSING_DATABASE)
					expect(getErrorMessage(error)).toBe("Database name is required")
				}
			)
		})

		it("should return error for missing username", () => {
			convertToJdbcUrl("postgresql://:pass@localhost:5432/mydb").mapErr(
				(error) => {
					expect(error).toBe(ERROR_CODES.MISSING_USERNAME)
					expect(getErrorMessage(error)).toBe("Username is required")
				}
			)
		})

		it("should return error for invalid URL format", () => {
			convertToJdbcUrl("not-a-url").mapErr((error) => {
				expect(error).toBe(ERROR_CODES.INVALID_URL_FORMAT)
				expect(getErrorMessage(error)).toBe("Invalid URL format")
			})
		})

		it("should return error for database name with trailing slash", () => {
			convertToJdbcUrl("postgresql://user:pass@localhost:5432/mydb/").mapErr(
				(error) => {
					expect(error).toBe(ERROR_CODES.MISSING_DATABASE)
					expect(getErrorMessage(error)).toBe("Database name is required")
				}
			)
		})

		it("should return error for database name with path segments", () => {
			convertToJdbcUrl(
				"postgresql://user:pass@localhost:5432/mydb/extra"
			).mapErr((error) => {
				expect(error).toBe(ERROR_CODES.MISSING_DATABASE)
				expect(getErrorMessage(error)).toBe("Database name is required")
			})
		})
	})
})
