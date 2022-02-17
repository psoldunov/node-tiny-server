const fs = require('fs')
const path = require('path')

const serverInit = (public, reqFiles) => {
	const publicStr = public
	public = `./${public}/`

	//Creates public folder synchronously
	const makePublicDir = (public, reqFiles) => {
		if (!fs.existsSync(public)) {
			fs.mkdirSync(public)
			console.log('Public folder was successfully created')
			createReqFiles(public, reqFiles)
			process.exit()
		} else {
			console.log('Public folder OK')
			createReqFiles(public, reqFiles)
		}
	}

	//Creates required files synchronously
	const createReqFiles = (public, reqFiles) => {
		reqFiles.forEach((file) => {
			createFileSync(public, file)
		})
	}

	//Creates a file synchronously
	const createFileSync = (path, name) => {
		const fileUrl = path + name
		if (!fs.existsSync(fileUrl)) {
			fs.writeFileSync(fileUrl, '')
			console.log(`${name} was successfully created`)
		} else {
			console.log(`${name} exists`)
		}
	}

	//Gets for files in Public folder

	const getPublicFiles = function (folder, dirArr, fileArr) {
		files = fs.readdirSync(folder)

		dirArr = dirArr || []
		fileArr = fileArr || []

		files.forEach(function (file) {
			if (fs.statSync(folder + '/' + file).isDirectory()) {
				getPublicFiles(folder + '/' + file, dirArr, fileArr)
				dirArr.push(path.join(folder, '/', file))
			} else {
				fileArr.push(path.join(folder, '/', file))
			}
		})

		return { dirArr, fileArr }
	}

	//Load all files and dirs in one array of objects
	const sanitizePaths = () => {
		const { dirArr, fileArr } = getPublicFiles(public)

		const dirs = [{ filePath: public, reqUrl: '/', type: 'dir' }]
		const files = []

		dirArr.forEach((dir) => {
			const dirObj = {}

			dirObj.filePath = `./${dir}/`
			dirObj.reqUrl = dir.replace(publicStr, '')

			dirObj.type = 'dir'

			dirs.push(dirObj)
		})

		fileArr.forEach((file) => {
			const fileObj = {}

			fileObj.filePath = `./${file}`

			if (file.includes('.html')) {
				fileObj.reqUrl = file.replace('.html', '').replace(publicStr, '')
			} else {
				fileObj.reqUrl = file.replace(publicStr, '')
			}

			fileObj.type = 'file'

			files.push(fileObj)
		})

		dirs.forEach((dir) => {
			files.forEach((file, index, object) => {
				if (dir.reqUrl === file.reqUrl) {
					object.splice(index, 1)
				}
			})
		})

		return [...dirs, ...files]
	}

	makePublicDir(public, reqFiles)

	return sanitizePaths()
}

module.exports = { serverInit }
