"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { convertToJdbcUrl } from "@/lib/convert"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { useState } from "react"

export default function Page() {
	const [url, setUrl] = useState(
		"postgresql://postgres:GXthLZVjArmUkEsdLzCpYlSoQUCCetEs@shinkansen.proxy.rlwy.net:33234/railway"
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
			<div className={cn("space-y-1")}>
				<Label>PostgreSQL Connection String</Label>
				<div className={cn("flex", "flex-row", "gap-4")}>
					<Input value={url} onChange={(e) => setUrl(e.target.value)} />
					<Button variant={"outline"} size={"icon"} onClick={() => setUrl("")}>
						<X />
					</Button>
				</div>
			</div>
			{url.length > 0 && (
				<p className={cn("text-sm")}>
					{result.isOk() ? result.value : result.error}
				</p>
			)}
		</main>
	)
}
