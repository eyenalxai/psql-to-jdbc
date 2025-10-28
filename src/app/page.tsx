"use client"

import { Copy } from "lucide-react"
import { ResultAsync } from "neverthrow"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { convertToJdbcUrl, getErrorMessage } from "@/lib/convert"

const EXAMPLE_URL =
	"postgresql://user:password@localhost:5432/database?sslmode=require"

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

	const handleUseExample = () => {
		handleConvert(EXAMPLE_URL)
	}

	return (
		<main className="container mx-auto p-2 relative">
			<div className="w-full max-w-4xl space-y-8">
				<div className="space-y-4">
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<label htmlFor="input" className="text-sm font-medium">
								PostgreSQL URL
							</label>
							<Button
								onClick={handleUseExample}
								size="sm"
								variant="ghost"
								className="h-6 text-xs"
							>
								<Copy className="h-3 w-3 mr-1" />
								Use example
							</Button>
						</div>
						<Input
							id="input"
							placeholder={EXAMPLE_URL}
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
		</main>
	)
}
