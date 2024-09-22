import * as core from '@actions/core';
import { validateVariables} from "unity-ci-self-hosted-common/dist";
import { VariableValue } from "unity-ci-self-hosted-common/dist";

type Value = VariableValue;

export let variables = {
    // Environment variables
    GITHUB_WORKSPACE:   <Value>{ value: process.env.GITHUB_WORKSPACE, mandatory: true },

    // Github action inputs
    storage:                <Value>{ value: core.getInput('storage'),           mandatory: true},
    buildFolderFullPath:    <Value>{ value: core.getInput('buildFolderFullPath'),   mandatory: true},
    archiveFileName:        <Value>{ value: core.getInput('archiveFileName'), mandatory: true},
    archiveFolder: <Value>{ 
        value: core.getInput('archiveFolder'),    
        mandatory: false,
        default: process.env.GITHUB_WORKSPACE
    },
};

validateVariables(variables);
