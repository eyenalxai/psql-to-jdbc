"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { convertToJdbcUrl } from "@/lib/convert"
import { cn } from "@/lib/utils"
import { Copy, X } from "lucide-react"
import Link from "next/link"

import { useState } from "react"

export default function Page() {
	const [url, setUrl] = useState(
		"postgresql://user:password@host:5432/database"
	)

	const result = convertToJdbcUrl(url)

	return (
		<main
			className={cn(
				"container",
				"mx-auto",
				"max-w-screen-lg",
				"mt-12",
				"p-4",
				"space-y-4"
			)}
		>
			<div className={cn("flex", "flex-col", "items-start")}>
				<p className={cn("text-xs", "text-muted-foreground")}>
					Everything is done client-side. No data is sent anywhere.
				</p>
				<div
					className={cn(
						"flex",
						"flex-row",
						"gap-2",
						"items-center",
						"flex-wrap"
					)}
				>
					<p className={cn("text-xs", "text-muted-foreground")}>Source:</p>
					<Button
						asChild
						variant={"link"}
						className={cn("text-xs", "text-muted-foreground", "p-0")}
					>
						<Link href={"https://github.com/eyenalxai/psql-to-jdbc"}>
							https://github.com/eyenalxai/psql-to-jdbc
						</Link>
					</Button>
				</div>
			</div>
			<div className={cn("space-y-2")}>
				<Label>PostgreSQL Connection String</Label>
				<div className={cn("flex", "flex-row", "gap-4")}>
					<Input value={url} onChange={(e) => setUrl(e.target.value)} />
					<Button
						variant={"outline"}
						size={"icon"}
						onClick={() => setUrl("")}
						className={cn("cursor-pointer")}
					>
						<X />
					</Button>
				</div>
			</div>
			<div
				className={cn(
					"flex",
					"flex-row",
					"gap-4",
					"items-start",
					"justify-between"
				)}
			>
				<p className={cn("text-xs", "break-all")}>
					{url.length > 0 ? (result.isOk() ? result.value : result.error) : ""}
				</p>
				<Button
					disabled={!result.isOk()}
					variant={"outline"}
					size={"icon"}
					onClick={() => {
						if (result.isOk()) {
							navigator.clipboard.writeText(result.value)
						}
					}}
					className={cn("cursor-pointer")}
				>
					<Copy />
				</Button>
			</div>
		</main>
	)
}
