---
title: Streaming an S3 file from server to server
tags: [aws, backend, dev, nodejs, s3, web]
---

I thought this would be easy (because it's easy to stream from a backend to a frontend and vice versa) but it was not. Let's look at how to stream a file from an S3 connection on a server to _another server_ in Node.js.

<!-- truncate -->

1. Create a new `FormData` instance (the \_global built-in `FormData`):
    ```ts
    const formData = new FormData();
    ```
2. Create a stream of the file from S3:

    ```ts
    import {S3Client, GetObjectCommand} from '@aws-sdk/client-s3';

    const s3Client = new S3Client({
        region: yourRegion,
    });

    const {Body} = await s3Client.send(
        new GetObjectCommand({
            Bucket: bucketName,
            Key: bucketFilePath,
        }),
    );

    if (!Body) {
        throw new Error(`Failed to get S3 file: ${bucketName}:${bucketFilePath}`);
        return undefined;
    }

    const readableStream = Body.transformToWebStream();
    ```

3. Attach metadata to the stream (if necessary):
    ```ts
    formData.set(
        'metadata',
        new Blob(
            [
                JSON.stringify({
                    documentName: fileName,
                }),
            ],
            {
                type: 'application/json',
            },
        ),
        'metadata',
    );
    ```
4. Attach the stream (in this case a PDF):

    ```ts
    formData.set('file', {
        type: 'application/pdf',
        name: fileName,
        [Symbol.toStringTag]: 'File',
        stream() {
            return readableStream;
        },
    } as any as Blob);
    ```

    This awful hack is the only way I was able to get this to work. See the following links that I found useful:

    - https://stackoverflow.com/questions/75793118/streaming-multipart-form-data-request-with-native-fetch-in-node-js
    - https://stackoverflow.com/questions/72568850/nodejs-fetch-failed-object2-is-not-iterable-when-uploading-file-via-post-reque
    - https://www.npmjs.com/package/formdata-node

5. Install the [`form-data-encoder`](https://npmjs.com/package/form-data-encoder) package.
6. Create a `FormDataEncoder` instance:

    ```ts
    import {FormDataEncoder} from 'form-data-encoder';

    const formDataEncoder = new FormDataEncoder(formData);
    ```

7. Create a form data encoder stream for your request body:
    ```ts
    const body = Readable.from(formDataEncoder);
    ```
8. Send your request with headers and an undocumented and untyped `duplex` option (that is required or it won't work):
    ```ts
    const response = await fetch(url, {
        body,
        headers: formDataEncoder.headers,
        duplex: 'half',
    });
    ```

All together now:

```ts
import {S3Client, GetObjectCommand} from '@aws-sdk/client-s3';
import {FormDataEncoder} from 'form-data-encoder';

const formData = new FormData();

const s3Client = new S3Client({
    region: yourRegion,
});

const {Body} = await s3Client.send(
    new GetObjectCommand({
        Bucket: bucketName,
        Key: bucketFilePath,
    }),
);

if (!Body) {
    throw new Error(`Failed to get S3 file: ${bucketName}:${bucketFilePath}`);
    return undefined;
}

const readableStream = Body.transformToWebStream();

formData.set(
    'metadata',
    new Blob(
        [
            JSON.stringify({
                documentName: fileName,
            }),
        ],
        {
            type: 'application/json',
        },
    ),
    'metadata',
);

formData.set('file', {
    type: 'application/pdf',
    name: fileName,
    [Symbol.toStringTag]: 'File',
    stream() {
        return readableStream;
    },
} as any as Blob);

const formDataEncoder = new FormDataEncoder(formData);

const body = Readable.from(formDataEncoder);

const response = await fetch(url, {
    body,
    headers: formDataEncoder.headers,
    duplex: 'half',
});
```
