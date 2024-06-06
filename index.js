import express from 'express'
import fileUpload from 'express-fileupload'
import { uploadFile, getFiles, getFile, downloadFile, getFileURL } from './s3.js'

const app = express()

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: './uploads'
}))

app.get('/files', async (req, res) => {
    console.log('Request received for /files')
    const { continuationToken, maxKeys } = req.query
    console.log(`continuationToken: ${continuationToken}, maxKeys: ${maxKeys}`)
    const result = await getFiles(continuationToken, maxKeys)
    res.json(result)
})

app.get('/files/:fileName', async (req, res) => {
    const result = await getFileURL(req.params.fileName)
    res.json({
        url: result
    })
})

app.get('/downloadfile/:fileName', async (req, res) => {
    const result = await downloadFile(req.params.fileName)
    res.json({message: "archivo descargado"})
})

app.post('/files', async (req, res) => {
    const folderPath = req.body.folderPath || ''
    const result = await uploadFile(req.files.file, folderPath)
    res.json({ result })
})

app.use(express.static('images'))

app.listen(3000)
console.log('Server on port ${3000}')