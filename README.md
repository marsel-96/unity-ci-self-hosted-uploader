# Unity CI Self Hosted Uploader

# Package
```
npm run package'
```

# Test Script Locally

### Install ts-node
```
npm install -g ts-node typescript '@types/node'
```

### Set environment variables

```

$env:GITHUB_WORKSPACE = 'C:\Users\marco\Desktop\actions-runner\_work\test-game-ci\test-game-ci'

$env:INPUT_STORAGE = 'google'
$env:INPUT_LOCALDESTINATIONFOLDER = 'C:\Users\marco\Desktop'
$env:INPUT_UNITYBUILDNAME = 'Build-Test-Name'
$env:INPUT_UNITYBUILDVERSION = '0.1.0'
$env:INPUT_UNITYBUILDTARGET = 'StandaloneWindows64'
$env:INPUT_UNITYBUILDPATH = 'C:\Users\marco\Desktop\actions-runner\_work\test-game-ci\test-game-ci\build'
$env:INPUT_UNITYBUILDARCHIVEFOLDER = 'archive'
$env:INPUT_UNITYBUILDARCHIVEFILENAME = 'test.zip'

$env:INPUT_GOOGLEOAUTHCLIENTID = ''
$env:INPUT_GOOGLEOAUTHCLIENTSECRET = ''
$env:INPUT_GOOGLEOAUTHREDIRECTURI = 'https://developers.google.com/oauthplayground'
$env:INPUT_GOOGLEOAUTHREFRESHTOKEN = ''
$env:INPUT_GOOGLEFOLDERID = ''
```

### Run index.ts

```
ts-node src/index.ts
```