"use client"

import { Copy } from "lucide-react"
import { ResultAsync } from "neverthrow"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { convertToJdbcUrl, getErrorMessage } from "@/lib/convert"

export default function Page() {
	const [input, setInput] = useState("")
	const [output, setOutput] = useState("")
	const [error, setError] = useState("")

	const handleConvert = (value: string) => {
		setInput(value)

		if (!value.trim()) {
			setOutput("")
			setError("")
			return
		}

		convertToJdbcUrl(value).match(
			(jdbcUrl) => {
				setOutput(jdbcUrl)
				setError("")
			},
			(errorCode) => {
				setOutput("")
				setError(getErrorMessage(errorCode))
			}
		)
	}

	const handleCopy = () => {
		void ResultAsync.fromPromise(
			navigator.clipboard.writeText(output),
			() => "Failed to copy to clipboard"
		).match(
			() => {
				toast.success("Copied to clipboard")
			},
			(error) => {
				toast.error(error)
			}
		)
	}

	return (
		<main className="container mx-auto p-8 relative min-h-screen">
			<div className="w-full max-w-2xl space-y-8">
				<div className="space-y-4">
					<div className="space-y-2">
						<label htmlFor="input" className="text-sm font-medium">
							PostgreSQL URL
						</label>
						<Input
							id="input"
							placeholder="postgresql://user:password@localhost:5432/database"
							value={input}
							onChange={(e) => handleConvert(e.target.value)}
						/>
						{error && <p className="text-destructive text-sm">{error}</p>}
					</div>

					{output && (
						<div className="flex items-center gap-2">
							<code className="flex-1 text-xs break-all">{output}</code>
							<Button
								onClick={() => handleCopy()}
								size="icon"
								variant="outline"
							>
								<Copy />
							</Button>
						</div>
					)}
				</div>
			</div>
			<div className="fixed bottom-2 left-2 right-2 md:absolute md:right-auto md:bottom-4 md:left-4 text-[10px] md:text-xs text-muted-foreground font-mono max-w-full">
				<div className="flex flex-col gap-0.5 md:gap-1">
					<p className="leading-tight">Client-side only. No data sent.</p>
					<a
						href="https://github.com/eyenalxai/psql-to-jdbc"
						target="_blank"
						rel="noopener noreferrer"
						className="hover:underline leading-tight truncate"
						title="https://github.com/eyenalxai/psql-to-jdbc"
					>
						Source: github.com/eyenalxai/psql-to-jdbc
					</a>
				</div>
			</div>
		</main>
	)
}
