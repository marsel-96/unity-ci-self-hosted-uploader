import { copyFile, stat } from 'fs/promises';
import * as core from '@actions/core';
import * as logging from "unity-ci-self-hosted-common/dist";
import { validateVariables, VariableValue } from "unity-ci-self-hosted-common/dist";
import { join } from 'path';

type Value = VariableValue;

let localStorageVariables = {
    localDestinationFolder: <Value>{ value: core.getInput('localDestinationFolder'), mandatory: true }
}

export async function uploadFile(
    fileName: string,
    filePath: string
) {
    validateVariables(localStorageVariables);

    const localDestinationFilePath = join(localStorageVariables.localDestinationFolder.value, fileName);
    const fileSize = await stat(filePath).then((stats) => stats.size);

    console.log(`--------------------------------------------------------------------`)
    console.log(`Using Local Storage.`);
    console.log(`Moving File '${filePath}' to destination folder '${localDestinationFilePath}`);
    console.log(`File size: ${Math.round(fileSize / (1024 * 1024))} MB`);
    console.log(`--------------------------------------------------------------------`)

    try {
        await copyFile(filePath, localDestinationFilePath)
    } catch (error) {
        throw new Error('Error while moving file!', { cause: error });
    }

    console.log(`--------------------------------------------------------------------`)
    logging.logWithStyle(`File moved successfully!`, logging.ForegroundColor.Green)
    console.log(`--------------------------------------------------------------------`)
}



