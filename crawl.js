import jsdom from "jsdom";
const { JSDOM } = jsdom;

function normalizeURL(raw_url) {
	const url = new URL(raw_url)
	return `${url.host}${url.pathname}`.replace(/\/+$/, "")
}

function getURLsFromHTML(htmlBody, baseURL) {
	const urls = []
	const dom = new JSDOM(htmlBody)
	const anchors = dom.window.document.querySelectorAll('a')

	for (const anchor of anchors) {
		if (anchor.hasAttribute('href')) {
			let href = anchor.getAttribute('href')

			try {
				href = new URL(href, baseURL).href
				urls.push(href)
			} catch {
				console.log(`${err.message}: ${href}`)
			}
		}
	}

	return urls
}

async function crawlPage(url) {
	let response
	try {
		response = await fetch(url)
	} catch (err) {
		throw new Error(`Network error: ${err.message}`)
	}
	const responseStatus = response.status
	const responseContentType = response.headers.get('content-type')
	if (responseStatus >= 400) {
		const err = new Error(`HTTP Error: ${response.status}`)
		console.log(err.message)
		return
	} else if (~responstContentType || !responseContentType.includes('text/html')) {
		const err = new Error(`Response has invalid content-type: ${responseContentType}.`)
		console.log(err.message)
		return
	}
	const responseText = await response.text()
	console.log(responseText)
}

export { normalizeURL, getURLsFromHTML, crawlPage };
