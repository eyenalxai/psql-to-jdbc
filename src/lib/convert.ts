import { err, fromThrowable, ok } from "neverthrow"

const parseUrl = (input: string) => {
	if (input.includes("@/")) {
		return err("Hostname is required")
	}

	const parseUrlThrowable = fromThrowable(
		(url: string) => {
			const parsed = new URL(url)
			if (parsed.protocol !== "postgresql:") {
				throw new Error("Invalid protocol: URL must start with postgresql://")
			}
			return parsed
		},
		(error) => {
			if (error instanceof TypeError && error.message.includes("Invalid URL")) {
				return "Invalid URL format"
			}
			return error instanceof Error ? error.message : "Unknown error"
		}
	)

	return parseUrlThrowable(input)
}

const validateAndExtractComponents = (parsed: URL) => {
	const hostname = parsed.hostname
	const port = parsed.port || "5432"
	const database = parsed.pathname.slice(1)
	const username = decodeURIComponent(parsed.username)
	const password = parsed.password ? decodeURIComponent(parsed.password) : null

	if (!hostname || hostname === "") {
		const wasCheckedForHost = parsed.href.includes("@/")
		return err(
			wasCheckedForHost ? "Hostname is required" : "Hostname is required"
		)
	}
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

export const convertToJdbcUrl = (url: string) => {
	if (!url || typeof url !== "string") {
		return err("URL must be a non-empty string")
	}

	return parseUrl(url)
		.andThen(validateAndExtractComponents)
		.map((components) => buildJdbcUrl(components))
}
