function sortPages(pages) {
	return Object.entries(pages).sort((a, b) => b[1] - a[1])

}

function printReport(pages) {
	console.log('Starting to generate report...')
	pages = sortPages(pages)

	for (const [url, count] of pages) {
		console.log(`Found ${count} internal link(s) to ${url}`)
	}
	console.log('Done generating report.')

}

export { sortPages, printReport };
