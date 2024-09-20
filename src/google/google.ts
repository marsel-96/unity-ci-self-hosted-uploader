import {
    google,   // The top level object used to access services
    drive_v3, // For every service client, there is an exported namespace
    Auth,     // Namespace for auth related types
    Common,   // General types used throughout the library
} from 'googleapis';
import fs from 'fs';
import { googleVariables } from './input';
import { validateVariables } from 'unity-ci-self-hosted-common/dist';

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

    console.log(`Uploading file ${filePath} to Google Drive.`);

    return api.files.create({
        requestBody: {
            name: fileName,
            parents: [googleVariables.googleFolderId.value]
        },
        media: {
            mimeType: fileType,
            body: fs.createReadStream(filePath)
        },
        fields: "id,webViewLink"
    })
    .then((res) =>
    {
        const result = {
            id: res.data?.id ?? _throw("Missing 'id' field in response"),
            webViewLink: res.data?.webViewLink ?? _throw("Missing 'webViewLink' field in response")
        }
        console.log(`File uploaded successfully! \nWeb Link: ${result.webViewLink}`);
        return result;
    })
    .catch((err) => {
        throw new Error(`Failed to upload file: ${err}`);
    });
}