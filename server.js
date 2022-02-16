//Imports node modules
const http = require('http')
const fs = require('fs')
const path = require('path')

//Imports configuration file
const { port, public, reqFiles } = require('./config')

//Imports init functions
const { serverInit } = require('./init_functions')

//Initializes public folder, creates required files and loads all files and directories
const resources = serverInit(public, reqFiles)

const server = http.createServer((req, res) => {
	console.log(req.url, req.method)

	let currRes = resources.find((resource) => resource.reqUrl === req.url)

	let path = ''

	if (currRes) {
		if (currRes.type === 'dir') {
			path = currRes.filePath + 'index.html'
			res.statusCode = 200
			res.setHeader('Content-type', 'text/html')
		} else {
			path = currRes.filePath
			res.statusCode = 200
			res.setHeader('Content-type', currRes.type)
		}
	} else {
		path = `./${public}/404.html`
		res.statusCode = 404
		res.setHeader('Content-type', 'text/html')
	}

	fs.readFile(path, (err, data) => {
		if (err) {
			console.log(err)
			res.end()
		} else {
			res.end(data)
		}
	})
})

server.listen(port, 'localhost', () => {
	console.log(`Listening for requests on port ${port}`)
})
