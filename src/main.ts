import * as core from '@actions/core'
import { join, isAbsolute } from 'path'
import { variables } from './input'
import  * as google from './google/google';
import  * as local from './local/local';
import { zipFolder } from './zip/zip';

export async function run() {

  try {

    const archiveFileName = variables.archiveFileName.value + ".7z"
    const archiveFoldFullPath = isAbsolute(variables.archiveFolder.value) ? 
    variables.archiveFolder.value : join(variables.GITHUB_WORKSPACE.value, variables.archiveFolder.value)
    const archiveFileFullPath = join(archiveFoldFullPath, archiveFileName)

    await zipFolder(
      variables.buildFolderFullPath.value, 
      archiveFileFullPath
    );

    switch (variables.storage.value) {
      case 'local': {
        await local.uploadFile(
          archiveFileName, 
          archiveFileFullPath,
        )
      } break;
      case 'google': {
        await google.uploadFile(
          archiveFileName, 
          archiveFileFullPath,
        )
      } break;
      default: throw new Error(`Unknown upload location: ${variables.storage.value}`)
    }

  } catch (error) {

    if (error instanceof Error) {
      core.error(error)
    }
    else core.error("An unexpected error occurred")

    core.setFailed("Error during upload run")
  }

}
