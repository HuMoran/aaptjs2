/*
 * File: index.js
 * Project: aaptjs
 * Description: Android Asset Packaging Tool(aapt) for Node.js
 * Created By: Tao.Hu 2019-05-15
 * -----
 * Last Modified: 2019-05-15 11:52:33
 * Modified By: Tao.Hu
 * -----
 */
'use strict';
const fs = require('fs');
const util = require('util');
const access = util.promisify(fs.access);
const execFile = util.promisify(require('child_process').execFile);

async function aapt(args) {
  try {
    // darwin: macOS linux win32
    const aapt = `./bin/${process.platform}/aapt_64${process.platform === 'win32' ? '.exe' : ''}`;
    await access(aapt, fs.constants.X_OK);
    const { stdout } = await execFile(aapt, args);
    return stdout;
  } catch (error) {
    console.error('aapt error:', error.message);
    throw error;
  }
}

async function getApkInfo(filePath) {
  try {
    // darwin: macOS linux win32
    const aapt = `./bin/${process.platform}/aapt_64${process.platform === 'win32' ? '.exe' : ''}`;
    await access(aapt, fs.constants.X_OK);
    const { stdout } = await execFile(aapt, ['d', 'badging', filePath]);
    const match = stdout.match(/name='([^']+)'[\s]*versionCode='(\d+)'[\s]*versionName='([^']+)/);
    const matchName = stdout.match(/application: label='([^']+)'[\s]*icon='([^']+)/);
    const info = {
      package: match[1],
      version: match[3],
      name: matchName[1],
      icon: matchName[2],
    };
    if (!info.package || !info.version) {
      throw (new Error('Invalid Apk File'));
    }
    return info;
  } catch (error) {
    console.error('aapt error:', error.message);
    throw error;
  }
}

module.exports = {
  aapt,
  getApkInfo,
};