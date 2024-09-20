import * as core from '@actions/core';
import { VariableValue} from "unity-ci-self-hosted-common/dist";

type Value = VariableValue;

export let googleVariables = {
    // Github action inputs
    googleOauthClientId:        <Value>{ value: core.getInput('googleOauthClientId'),       mandatory: true  },
    googleOauthClientSecret:    <Value>{ value: core.getInput('googleOauthClientSecret'),   mandatory: true, },
    googleOauthRedirectUri:     <Value>{ value: core.getInput('googleOauthRedirectUri'),    mandatory: true  },
    googleOauthRefreshToken:    <Value>{ value: core.getInput('googleOauthRefreshToken'),   mandatory: true, },
    googleFolderId:             <Value>{ value: core.getInput('googleFolderId'),            mandatory: true, },  
};