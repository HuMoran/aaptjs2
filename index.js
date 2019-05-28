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
const path = require('path');
const access = util.promisify(fs.access);
const chmod = util.promisify(fs.chmod);
const writeFile = util.promisify(fs.writeFile);
const mkdir = util.promisify(fs.mkdir);
const execFile = util.promisify(require('child_process').execFile);

async function aapt(args) {
  try {
    // darwin: macOS linux win32
    const aapt = path.join(__dirname, 'bin', process.platform, `aapt_64${process.platform === 'win32' ? '.exe' : ''}`);
    await access(aapt, fs.constants.F_OK);
    if (process.platform === 'linux' || process.platform === 'darwin') {
      await chmod(aapt, '755');
    }
    const { stdout } = await execFile(aapt, args);
    return stdout;
  } catch (error) {
    console.error('aapt error:', error.message);
    throw error;
  }
}

function list(filePath) {
  return aapt(['l', filePath]);
}

function dump(filePath, values) {
  return aapt(['d', values, filePath]);
}

function packageCmd(filePath, command) {
  return aapt(['p', command, filePath]);
}

function remove(filePath, files) {
  let tmpFiles = files;
  if (!Array.isArray(tmpFiles)) {
    tmpFiles = [tmpFiles];
  }
  return aapt(['r', filePath, ...tmpFiles]);
}

function add(filePath, files) {
  let tmpFiles = files;
  if (!Array.isArray(tmpFiles)) {
    tmpFiles = [tmpFiles];
  }
  return aapt(['a', filePath, ...tmpFiles]);
}

function crunch(resource, outputFolder) {
  let tmpResource = resource;
  if (!Array.isArray(tmpResource)) {
    tmpResource = [tmpResource];
  }
  return aapt(['c', '-S', ...tmpResource, '-C', outputFolder]);
}

function singleCrunch(inputFile, outputFile) {
  return aapt(['s', '-i', inputFile, '-o', outputFile]);
}

function version() {
  return aapt(['v']);
}

async function getApkInfo(filePath) {
  try {
    const stdout = await dump(filePath, 'badging');
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

async function getApkAndIcon(filePath, outIconName, outIconPath = './') {
  try {
    if (!filePath || !outIconName) {
      throw (new Error('Invalid parameter'));
    }
    const apkInfo = await getApkInfo(filePath);
    if (apkInfo.icon) {
      const { stdout } = await execFile('unzip', ['-p', filePath, apkInfo.icon], { encoding: 'buffer' });
      await mkdir(outIconPath, { recursive: true });
      await writeFile(`${outIconPath}/${outIconName}`, stdout);
      return {
        ...apkInfo,
        iconPath: `${outIconPath}/${outIconName}`,
      };
    }
  } catch (error) {
    console.error('aapt error:', error.message);
    throw error;
  }
}

module.exports = {
  aapt,
  list,
  dump,
  packageCmd,
  remove,
  add,
  crunch,
  singleCrunch,
  version,
  getApkInfo,
  getApkAndIcon,
};