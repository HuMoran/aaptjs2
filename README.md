# aaptjs2

Android Asset Packaging Tool(aapt) for Node.js

## Install

With npm do:

`npm install aaptjs2 --save`

## Example

```javascript
const aapt = require('aaptjs2');

aapt.list('/path/to/your/ExampleApp.apk')
  .then (data => {
    console.log(data)
  })
  .catch (err) {
    // something went wrong 
  }
```

## API

* aapt(args)
* listlist(apkFilePath)
* dump(apkFilePath, values)
* packageCmd(apkFilePath, command)
* remove(apkFilePath, files)
* add(apkFilePath, files)
* crunch(resource, outputFolder)
* singleCrunch(inputFile, outputfile)
* version()
* getApkInfo(apkFilePath)
* getApkAndIcon(apkFilePath, outIconPath)