import { logLines, runCommand, validateVariables, VariableValue } from "unity-ci-self-hosted-common/dist";
import { join, dirname, basename } from "path";
import { variables } from "src/input";
import * as core from '@actions/core'


type Value = VariableValue;

let zipVariables = {
    zipCompressionLevel:  <Value>{ value: core.getInput('zipCompressionLevel'), mandatory: false, default: "2" }
}

export async function zipFolder(
    toArchiveFolderPath: string, 
    zipOutputFilePath: string,
    zstd: boolean = false
) {

    validateVariables(zipVariables);

    // Check if the script is the main module
    let command;

    if (require.main) {
        const mainModuleDir = dirname(require.main.filename);
        command = join(
            mainModuleDir,
            basename(mainModuleDir) === "src" ? "../dist" : "",
            "windows/7zr.exe"
        );
    } else throw new Error("Cannot determine the main module");

    const args = [
        'a', toArchiveFolderPath,
        '-m0=LZMA2',
        `-mx${zipVariables.zipCompressionLevel.value}`, 
        zipOutputFilePath
    ]

    console.log(`Using 7zip command: ${command}`)
    console.log(`Zipping folder '${toArchiveFolderPath}' into archive file '${zipOutputFilePath}\n...`)

    let exitCode = 0
    
    try {
        exitCode = await runCommand(command, args)
    } catch (error) {
        console.error(`Exception while zipping folder!`)
        throw error
    }

    if (exitCode !== 0) {
        throw new Error(`\n\nZipping folder operation failed! Exit code: ${exitCode}`);
    }

    logLines(
        '',
        `Zip file '${zipOutputFilePath}' created successfully!`,
        '',
    )
    
}