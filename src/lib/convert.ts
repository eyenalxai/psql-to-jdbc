import type { Result } from "neverthrow"
import { err, ok } from "neverthrow"

const validateAndExtractComponents = (parsed: URL) => {
	const hostname = parsed.hostname
	const port = parsed.port || "5432"
	const database = parsed.pathname.slice(1)
	const username = decodeURIComponent(parsed.username)
	const password = parsed.password ? decodeURIComponent(parsed.password) : null

	if (!hostname || hostname === "") return err("Hostname is required")
	if (!database) return err("Database name is required")
	if (!username) return err("Username is required")

	return ok({ hostname, port, database, username, password })
}

const buildJdbcUrl = ({
	hostname,
	port,
	database,
	username,
	password
}: {
	hostname: string
	port: string
	database: string
	username: string
	password: string | null
}) => {
	const baseUrl = `jdbc:postgresql://${hostname}:${port}/${database}?user=${encodeURIComponent(username)}`
	return password
		? `${baseUrl}&password=${encodeURIComponent(password)}`
		: baseUrl
}

export const convertToJdbcUrl = (url: string): Result<string, string> => {
	if (!url || typeof url !== "string") {
		return err("URL must be a non-empty string")
	}

	const parseUrl = (input: string): Result<URL, string> => {
		try {
			const parsed = new URL(input)
			if (parsed.protocol !== "postgresql:") {
				return err("Invalid protocol: URL must start with postgresql://")
			}
			return ok(parsed)
		} catch (error) {
			if (error instanceof TypeError && error.message.includes("Invalid URL")) {
				const hasNoHost = input.includes("@/")
				if (hasNoHost) {
					return err("Hostname is required")
				}
			}
			return err(error instanceof Error ? error.message : "Unknown error")
		}
	}

	try {
		return parseUrl(url).andThen(validateAndExtractComponents).map(buildJdbcUrl)
	} catch (error) {
		return err(error instanceof Error ? error.message : "Unknown error")
	}
}
