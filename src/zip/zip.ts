import { runCommand, validateVariables, VariableValue } from "unity-ci-self-hosted-common/dist";
import { join, dirname, basename } from "path";
import * as core from '@actions/core'
import * as logging from "unity-ci-self-hosted-common/dist";

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

    const toArchiveFolderPathWildcard = join(toArchiveFolderPath, "*");
    const args = [
        'a', zipOutputFilePath,
        '-m0=LZMA2',
        `-mx${zipVariables.zipCompressionLevel.value}`, 
        toArchiveFolderPathWildcard
    ]

    console.log(`--------------------------------------------------------------------`)
    console.log(`Using 7zip. Compression level: ${zipVariables.zipCompressionLevel.value}`)
    console.log(`Zipping folder '${toArchiveFolderPath}' into archive file '${zipOutputFilePath}`)
    console.log(`--------------------------------------------------------------------`)

    let exitCode = 0
    
    try {
        core.startGroup('Zip file')
        exitCode = await runCommand(command, args)
        core.endGroup()
    } catch (error) {
        core.endGroup()
        throw new Error(`Exception while zipping folder!`, {cause: error})
    }

    if (exitCode !== 0) {
        throw new Error(`\nZipping folder operation failed! Exit code: ${exitCode}`);
    }
    

    console.log(`--------------------------------------------------------------------`)
    logging.logWithStyle('Zip file created Successfully!', logging.ForegroundColor.Green)
    console.log(`--------------------------------------------------------------------`)
}