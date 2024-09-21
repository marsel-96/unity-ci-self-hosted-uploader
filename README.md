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

$env:INPUT_BUILDFOLDERFULLPATH = 'C:\Users\marco\Desktop\actions-runner\_work\test-game-ci\test-game-ci\build'
$env:INPUT_ARCHIVEFOLDER = 'archive'
$env:INPUT_ARCHIVEFILENAME = 'test.zip'

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