import path from "node:path"
import { defineConfig } from "vitest/config"

export default defineConfig({
	test: {
		exclude: [
			"**/node_modules/**",
			"**/dist/**",
			"**/cypress/**",
			"**/.{idea,git,cache,output,temp}/**",
			"**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*"
		]
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src/")
		}
	}
})
