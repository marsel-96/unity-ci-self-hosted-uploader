import * as core from '@actions/core'
import { runCommand } from "unity-ci-self-hosted-common/dist";
import { logLines } from "unity-ci-self-hosted-common/dist";
import { join, isAbsolute } from 'path'
import { variables } from './input'
import  * as google from './google/google';
import  * as local from './local/local';
import { zipFolder } from './zip/zip';


export async function run() {

  try {

    const buildArchiveName = variables.unityBuildArchiveFileName.value
    if (!buildArchiveName.endsWith('.zip')) {
      throw new Error(`Invalid archive file name: ${buildArchiveName}. Must end with '.zip'`)
    }

    const buildArchiveBasePath = isAbsolute(variables.unityBuildArchiveFolder.value) ? 
    variables.unityBuildArchiveFolder.value : join(variables.GITHUB_WORKSPACE.value, variables.unityBuildArchiveFolder.value)
    const buildArchiveFullPath = join(buildArchiveBasePath, buildArchiveName)
    const toArchiveFolderPath = variables.unityBuildPath.value

    await zipFolder(
      toArchiveFolderPath, 
      buildArchiveFullPath, 
      true
    );

    switch (variables.storage.value) {
      case 'local': {
        await local.uploadFile(
          buildArchiveName, 
          buildArchiveFullPath,
        )
      } break;
      case 'google': {
        google.uploadFile(
          buildArchiveName, 
          buildArchiveFullPath,
        )
      } break;
      default: throw new Error(`Unknown upload location: ${variables.storage.value}`)
    }

  } catch (error) {
    if (error instanceof Error) {
      console.error(error)
      core.setFailed("Error during upload run")
    }
    else core.setFailed("An unexpected error occurred")
  }

}
