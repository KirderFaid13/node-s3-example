import { S3Client, PutObjectCommand, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3'
import { AWS_BUCKET_NAME, AWS_BUCKET_REGION, AWS_PUBLIC_KEY, AWS_SECRET_KEY } from './config.js'
import fs from 'fs'
import {getSignedUrl} from '@aws-sdk/s3-request-presigner'

const client = new S3Client({
    region: AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: AWS_PUBLIC_KEY,
        secretAccessKey: AWS_SECRET_KEY
    }
})

export async function uploadFile(file, folderPath = '') {
    const stream = fs.createReadStream(file.tempFilePath)
    const uploadParams = {
        Bucket: AWS_BUCKET_NAME,
        Key: `${folderPath}/${file.name}`,
        Body: stream
    }


    const command = new PutObjectCommand(uploadParams)
    return await client.send(command)

}

export async function getFiles(continuationToken = null, maxKeys = 10) {
    const commandParams = {
        Bucket: AWS_BUCKET_NAME,
        MaxKeys: maxKeys
    }
    if (continuationToken) {
        commandParams.ContinuationToken = continuationToken
    }
    const command = new ListObjectsV2Command(commandParams)
    return await client.send(command)

}

export async function getFile(filename) {
    const command = new GetObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: filename
    })
    return await client.send(command)
}

export async function downloadFile(filename) {
    const command = new GetObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: filename
    })
    const result = await client.send(command)
    console.log(result)
    result.Body.pipe(fs.createWriteStream(`./images/${filename}`))
}

export async function getFileURL(filename) {
    const command = new GetObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: filename
    })
    return await getSignedUrl(client, command);
}
