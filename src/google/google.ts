import { google, Auth, drive_v3 } from 'googleapis';
import { stat } from 'fs/promises';
import { createReadStream } from 'fs';
import { googleVariables } from './input';
import { validateVariables } from 'unity-ci-self-hosted-common/dist';
import * as logging from "unity-ci-self-hosted-common/dist";
import * as core from '@actions/core'

type API = drive_v3.Drive;

const _throw = (msg: string) => { throw new Error(msg); };

function createOAuthClient(
    oauthClientId: string,
    oauthClientSecret: string,
    oauthRedirectUri: string,
    oauthRefreshToken: string
): Auth.OAuth2Client {

    // Create OAuth 2.0 client.
    const client = new google.auth.OAuth2(
        oauthClientId, // Your GCP OAuth 2.0 application client ID.
        oauthClientSecret, // Your GCP OAuth 2.0 application client secret.
        oauthRedirectUri // https://developers.google.com/oauthplayground
    );

    // Set client refresh token (not the access token).
    client.setCredentials({
        refresh_token: oauthRefreshToken
    });

    return client;
}

function getApi(): API {

    let authType = "oauth2";
    let authClient = (() => {
        switch (authType) {
            case "oauth2":
                return createOAuthClient(
                    googleVariables.googleOauthClientId.value,
                    googleVariables.googleOauthClientSecret.value,
                    googleVariables.googleOauthRedirectUri.value,
                    googleVariables.googleOauthRefreshToken.value
                )
            default:
                throw new Error(`Unknown auth type: ${authType}`);
        }
    }).call(void 0);

    return google.drive({
        version: "v3",
        auth: authClient,
    });
}

export async function uploadFile(
    fileName: string,
    filePath: string,
    fileType = "application/zip",
): Promise<{ id: string, webViewLink: string }> {
    
    validateVariables(googleVariables);

    const api = getApi();
    const fileSize = await stat(filePath).then((stats) => stats.size);

    console.log(`--------------------------------------------------------------------`)
    console.log(`Using Google Drive.`);
    console.log(`Uploading file ${filePath}`);
    console.log(`File size: ${Math.round(fileSize / (1024*1024))} MB`);
    console.log(`--------------------------------------------------------------------`)

    let printProgess = true

    try {
        
        core.startGroup('Upload file')
        const response = await api.files.create(
            {
                requestBody: {
                    name: fileName,
                    parents: [googleVariables.googleFolderId.value]
                },
                media: {
                    mimeType: fileType,
                    body: createReadStream(filePath)
                },
                fields: "id,webViewLink"
            },
            {
                onUploadProgress: (evt) => {
                const progress = (evt.bytesRead / fileSize * 100) ;
                if (printProgess || progress === 100.0) {
                    console.log(`Progress: ${progress.toFixed(1)}%`);
                    setTimeout(() => printProgess = true, 250)
                    printProgess = false
                }
                },
            }
        )
        
        core.endGroup()

        const result = {
            id: response.data?.id ?? _throw("Missing 'id' field in response"),
            webViewLink: response.data?.webViewLink ?? _throw("Missing 'webViewLink' field in response")
        }
        
        console.log(`--------------------------------------------------------------------`)
        logging.logWithStyle(`File uploaded successfully! \nWeb Link: ${result.webViewLink}`, logging.ForegroundColor.Green)
        console.log(`--------------------------------------------------------------------`)

        return result;

    } catch(error) {
        core.endGroup()
        throw new Error('Exception while uploading file.', {cause: error})
    };
}