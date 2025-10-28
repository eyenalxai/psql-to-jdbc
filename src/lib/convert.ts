import { err, fromThrowable, ok, type Result } from "neverthrow"

type PostgresComponents = {
	hostname: string
	port: string
	database: string
	username: string
	password: string | null
}

const DEFAULT_PORT = "5432"

export const ERROR_CODES = {
	INVALID_INPUT: "INVALID_INPUT",
	INVALID_URL_FORMAT: "INVALID_URL_FORMAT",
	INVALID_PROTOCOL: "INVALID_PROTOCOL",
	MISSING_HOSTNAME: "MISSING_HOSTNAME",
	MISSING_DATABASE: "MISSING_DATABASE",
	MISSING_USERNAME: "MISSING_USERNAME",
	UNKNOWN_ERROR: "UNKNOWN_ERROR"
} as const

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES]

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
	[ERROR_CODES.INVALID_INPUT]: "URL must be a non-empty string",
	[ERROR_CODES.INVALID_URL_FORMAT]: "Invalid URL format",
	[ERROR_CODES.INVALID_PROTOCOL]:
		"Invalid protocol: URL must start with either postgresql:// or postgres://",
	[ERROR_CODES.MISSING_HOSTNAME]: "Hostname is required",
	[ERROR_CODES.MISSING_DATABASE]: "Database name is required",
	[ERROR_CODES.MISSING_USERNAME]: "Username is required",
	[ERROR_CODES.UNKNOWN_ERROR]: "Unknown error"
}

export const getErrorMessage = (code: ErrorCode): string => {
	return ERROR_MESSAGES[code]
}

const parsePostgresUrl = fromThrowable(
	(input: string): URL => {
		const url = new URL(input)

		if (url.protocol !== "postgresql:" && url.protocol !== "postgres:") {
			throw new Error(ERROR_CODES.INVALID_PROTOCOL)
		}

		return url
	},
	(error): ErrorCode => {
		if (error instanceof TypeError && error.message.includes("Invalid URL")) {
			return ERROR_CODES.INVALID_URL_FORMAT
		}
		if (
			error instanceof Error &&
			error.message === ERROR_CODES.INVALID_PROTOCOL
		) {
			return ERROR_CODES.INVALID_PROTOCOL
		}
		return ERROR_CODES.UNKNOWN_ERROR
	}
)

const extractComponents = (url: URL): Result<PostgresComponents, ErrorCode> => {
	const hostname = url.hostname
	const port = url.port || DEFAULT_PORT
	const database = url.pathname.slice(1)
	const username = url.username ? decodeURIComponent(url.username) : ""
	const password = url.password ? decodeURIComponent(url.password) : null

	if (!hostname) {
		return err(ERROR_CODES.MISSING_HOSTNAME)
	}

	if (!database || database.endsWith("/") || database.includes("/")) {
		return err(ERROR_CODES.MISSING_DATABASE)
	}

	if (!username) {
		return err(ERROR_CODES.MISSING_USERNAME)
	}

	return ok({ hostname, port, database, username, password })
}

const buildJdbcUrl = (components: PostgresComponents): string => {
	const { hostname, port, database, username, password } = components
	const base = `jdbc:postgresql://${hostname}:${port}/${database}?user=${encodeURIComponent(username)}`

	return password ? `${base}&password=${encodeURIComponent(password)}` : base
}

export const convertToJdbcUrl = (input: string): Result<string, ErrorCode> => {
	if (!input || typeof input !== "string") {
		return err(ERROR_CODES.INVALID_INPUT)
	}

	const trimmedInput = input.trim()

	if (trimmedInput.includes("@/")) {
		return err(ERROR_CODES.MISSING_HOSTNAME)
	}

	return parsePostgresUrl(trimmedInput)
		.andThen(extractComponents)
		.map((components) => buildJdbcUrl(components))
}
