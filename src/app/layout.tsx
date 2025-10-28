// oxlint-disable-next-line import/no-unassigned-import
import "./globals.css"
import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans"
import type { Metadata, Viewport } from "next"
import type { ReactNode } from "react"
import { Providers } from "@/components/providers"
import { cn } from "@/lib/utils"

const TITLE = "PostgreSQL to JDBC URL Converter"
const DESCRIPTION = "Convert PostgreSQL URLs to JDBC URLs"

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
		<html
			lang="en"
			suppressHydrationWarning
			className={cn(GeistSans.variable, GeistMono.variable)}
		>
			<body className={cn("antialiased")}>
				<Providers attribute="class" defaultTheme="system" enableSystem>
					{children}
					<footer className="fixed bottom-2 left-2 right-2 md:absolute md:right-auto md:bottom-4 md:left-4 text-[10px] md:text-xs text-muted-foreground font-mono max-w-full">
						<div className="flex flex-col gap-0.5 md:gap-1">
							<p className="leading-tight">Client-side only. No data sent.</p>
							<p className="leading-tight">
								Verify: DevTools → Network tab shows zero requests.
							</p>
							<p className="leading-tight">
								Source maps included for browser inspection.
							</p>
							<a
								href="https://github.com/eyenalxai/psql-to-jdbc"
								target="_blank"
								rel="noopener noreferrer"
								className="hover:underline leading-tight truncate"
								title="https://github.com/eyenalxai/psql-to-jdbc"
							>
								github.com/eyenalxai/psql-to-jdbc
							</a>
						</div>
					</footer>
				</Providers>
			</body>
		</html>
	)
}
