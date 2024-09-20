import * as core from '@actions/core';
import { validateVariables} from "unity-ci-self-hosted-common/dist";
import { VariableValue } from "unity-ci-self-hosted-common/dist";

type Value = VariableValue;

export let variables = {
    // Environment variables
    GITHUB_WORKSPACE:   <Value>{ value: process.env.GITHUB_WORKSPACE, mandatory: true },

    // Github action inputs
    storage:            <Value>{ value: core.getInput('storage'),           mandatory: true},
    unityBuildPath:     <Value>{ value: core.getInput('unityBuildPath'),    mandatory: true},
    unityBuildName:     <Value>{ value: core.getInput('unityBuildName'),    mandatory: true},
    unityBuildVersion:  <Value>{ value: core.getInput('unityBuildVersion'), mandatory: true},
    unityBuildTarget:   <Value>{ value: core.getInput('unityBuildTarget'),  mandatory: true},
    unityBuildArchiveFolder: <Value>{ 
        value: core.getInput('unityBuildArchiveFolder'),    
        mandatory: false,
        default: process.env.GITHUB_WORKSPACE
    },
    unityBuildArchiveFileName: <Value>{ 
        value: core.getInput('unityBuildArchiveFileName'), 
        mandatory: false, 
        default: `${core.getInput('unityBuildName')}_${core.getInput('unityBuildVersion')}.zip`
    },
};

validateVariables(variables);
