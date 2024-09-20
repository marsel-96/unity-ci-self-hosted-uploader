import {copyFile} from 'fs/promises';
import * as core from '@actions/core';
import { validateVariables, VariableValue} from "unity-ci-self-hosted-common/dist";
import { join } from 'path';

type Value = VariableValue;

let localStorageVariables = {
    localDestinationFolder:  <Value>{ value: core.getInput('localDestinationFolder'),    mandatory: true }
}

export async function uploadFile(
    fileName: string,
    filePath: string
) {
    validateVariables(localStorageVariables);

    const localDestinationFilePath = join(localStorageVariables.localDestinationFolder.value, fileName);

    console.log(`Moving File '${filePath}' to destination folder '${localDestinationFilePath}'\n...`);

    try {
        await copyFile(filePath, localDestinationFilePath)
    } catch (error) {
        console.error(`Error while moving file!`)
        throw error;
    }

    console.info(`File moved successfully!`)
}



