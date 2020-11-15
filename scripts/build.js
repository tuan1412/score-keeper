const fs = require('fs-extra');
const path = require('path');
const execSync = require('child_process').execSync;

const pathBuild = path.resolve(__dirname, '../build');
const pathPublic = path.resolve(__dirname, '../public');
const pathJS = path.resolve(__dirname, '../public/js');
const pathBuildJS = path.resolve(__dirname, '../build/js')

fs.emptyDirSync(pathBuild);

fs.copySync(pathPublic, pathBuild, {
  dereference: true,
  filter: file => file !== pathJS,
});

execSync(`javascript-obfuscator ${pathJS} --output ${pathBuildJS}`)
