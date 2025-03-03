import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

export const Footer = () => {
	return (
		<footer className={cn("fixed", "bottom-0", "w-full", "p-4")}>
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
		</footer>
	)
}
