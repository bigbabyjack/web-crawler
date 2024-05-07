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
			} catch (err) {
				console.log(`Error making URL: ${err.message}: ${href}`)
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
	} else if (!responseContentType || !responseContentType.includes('text/html')) {
		const err = new Error(`Response has invalid content-type: ${responseContentType}.`)
		console.log(err.message)
		return
	}
	const responseText = await response.text()
	return responseText
}

async function crawlPageR(baseURL, currentURL = baseURL, pages = {}) {
	const baseURLObj = new URL(baseURL)
	const currentURLObj = new URL(currentURL)
	if (baseURLObj.hostname !== currentURLObj.hostname) {
		return pages
	}

	const normCurrentURL = normalizeURL(currentURL)
	if (normCurrentURL in pages) {
		pages[normCurrentURL]++
		return pages
	}
	pages[normCurrentURL] = 1

	let htmlBody = ''
	try {
		htmlBody = await crawlPage(currentURL)
	} catch (err) {
		console.log(err.message)
		return pages
	}
	const urls = getURLsFromHTML(htmlBody, baseURL)
	for (const url of urls) {
		crawlPageR(baseURL, url, pages)
	}

	return pages
}


export { normalizeURL, getURLsFromHTML, crawlPageR };
