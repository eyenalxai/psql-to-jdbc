import { err, ok } from "neverthrow"
import type { Result } from "neverthrow"

export const convertToJdbcUrl = (url: string): Result<string, string> => {
	try {
		if (!url || typeof url !== "string") {
			return err("URL must be a non-empty string")
		}

		let parsedUrl: URL
		try {
			parsedUrl = new URL(url)
		} catch (error) {
			if (error instanceof TypeError && error.message.includes("Invalid URL")) {
				const hasNoHost = url.includes("@/")

				if (hasNoHost) {
					return err("Hostname is required")
				}
			}
			return err(error instanceof Error ? error.message : "Unknown error")
		}

		if (parsedUrl.protocol !== "postgresql:") {
			return err("Invalid protocol: URL must start with postgresql://")
		}

		const hostname = parsedUrl.hostname
		const port = parsedUrl.port || "5432"
		const database = parsedUrl.pathname.slice(1)
		const username = decodeURIComponent(parsedUrl.username)
		const password = parsedUrl.password
			? decodeURIComponent(parsedUrl.password)
			: null

		if (!hostname || hostname === "") return err("Hostname is required")
		if (!database) return err("Database name is required")
		if (!username) return err("Username is required")

		let jdbcUrl = `jdbc:postgresql://${hostname}:${port}/${database}?user=${encodeURIComponent(username)}`

		if (password) {
			jdbcUrl += `&password=${encodeURIComponent(password)}`
		}

		return ok(jdbcUrl)
	} catch (error) {
		return err(error instanceof Error ? error.message : "Unknown error")
	}
}
