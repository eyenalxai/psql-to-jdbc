import { err, ok } from "neverthrow"

export const convertToJdbcUrl = (url: string) => {
	const prefix = "postgresql://"

	if (!url.startsWith(prefix)) {
		return err("Invalid PostgreSQL URL format")
	}

	const urlWithoutPrefix = url.slice(prefix.length)

	// Find the last @ which separates credentials from host
	const lastAtIndex = urlWithoutPrefix.lastIndexOf("@")
	const credentials = urlWithoutPrefix.slice(0, lastAtIndex)
	const hostAndDatabase = urlWithoutPrefix.slice(lastAtIndex + 1)

	const [username, password] = credentials.split(":")
	const [host, database] = hostAndDatabase.split("/")
	const [hostname, port] = host.split(":")

	return ok(
		`jdbc:postgresql://${hostname}:${port}/${database}?user=${username}&password=${password}`
	)
}
