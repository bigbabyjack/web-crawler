import { argv, exit } from 'node:process'
import { crawlPage } from './crawl.js'

async function main() {
	if (argv.length < 3) {
		const err = new Error("Must pass an argument.")
		console.log(err)
		process.exit(1)
	} else if (argv.length > 3) {
		const err = new Error("Too many arguments.")
		console.log(err)
		process.exit(1)
	} else {
		const baseURL = argv[2]
		console.log(`Crawling: ${baseURL}`)
		await crawlPage(baseURL)

	}
}

main()
