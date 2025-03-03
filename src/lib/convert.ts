export const convertToJdbcUrl = (url: string): string => {
	const prefix = "postgresql://"

	if (!url.startsWith(prefix)) {
		throw new Error("Invalid PostgreSQL URL format")
	}

	const [credentialsAndHost, database] = url.slice(prefix.length).split("/")
	const [credentials, host] = credentialsAndHost.split("@")
	const [username, password] = credentials.split(":")
	const [hostname, port] = host.split(":")

	return `jdbc:postgresql://${hostname}:${port}/${database}?user=${username}&password=${password}`
}
