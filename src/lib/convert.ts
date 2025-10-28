import { err, fromThrowable, ok, type Result } from "neverthrow"

type PostgresComponents = {
	hostname: string
	port: string
	database: string
	username: string
	password: string | null
}

const DEFAULT_PORT = "5432"

const parsePostgresUrl = fromThrowable(
	(input: string): URL => {
		const url = new URL(input)

		if (url.protocol !== "postgresql:") {
			throw new Error("Invalid protocol: URL must start with postgresql://")
		}

		return url
	},
	(error): string => {
		if (error instanceof TypeError && error.message.includes("Invalid URL")) {
			return "Invalid URL format"
		}
		return error instanceof Error ? error.message : "Unknown error"
	}
)

const extractComponents = (url: URL): Result<PostgresComponents, string> => {
	const hostname = url.hostname
	const port = url.port || DEFAULT_PORT
	const database = url.pathname.slice(1)
	const username = url.username ? decodeURIComponent(url.username) : ""
	const password = url.password ? decodeURIComponent(url.password) : null

	if (!hostname) {
		return err("Hostname is required")
	}

	if (!database) {
		return err("Database name is required")
	}

	if (!username) {
		return err("Username is required")
	}

	return ok({ hostname, port, database, username, password })
}

const buildJdbcUrl = (components: PostgresComponents): string => {
	const { hostname, port, database, username, password } = components
	const base = `jdbc:postgresql://${hostname}:${port}/${database}?user=${encodeURIComponent(username)}`

	return password ? `${base}&password=${encodeURIComponent(password)}` : base
}

export const convertToJdbcUrl = (input: string): Result<string, string> => {
	if (!input || typeof input !== "string") {
		return err("URL must be a non-empty string")
	}

	if (input.includes("@/")) {
		return err("Hostname is required")
	}

	return parsePostgresUrl(input)
		.andThen(extractComponents)
		.map((components) => buildJdbcUrl(components))
}
