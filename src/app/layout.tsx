import { Footer } from "@/components/footer"
import "./globals.css"
import { Providers } from "@/components/providers"
import { cn } from "@/lib/utils"
import { GeistMono } from "geist/font/mono"
import type { Metadata, Viewport } from "next"
import type { ReactNode } from "react"

const TITLE = "PostgreSQL JDBC URL Converter"
const DESCRIPTION = "Convert your PostgreSQL connection string to a JDBC URL"

export const metadata: Metadata = {
	title: TITLE,
	description: DESCRIPTION,
	openGraph: {
		title: TITLE,
		description: DESCRIPTION,
		type: "website"
	}
}

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "0 0% 100%" },
		{ media: "(prefers-color-scheme: dark)", color: "222.2 84% 4.9%" }
	]
}

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={cn("font-mono", "antialiased", GeistMono.className)}>
				<Providers attribute="class" defaultTheme="system" enableSystem>
					{children}
					<Footer />
				</Providers>
			</body>
		</html>
	)
}
