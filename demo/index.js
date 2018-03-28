#!/usr/bin/env node

const start = require('../lib/index');

let args = [].slice.call(process.argv, 2);
if (args.length === 0) {
  console.log('missing projectName: ${projectName}');
  return process.exit();
}
let projectName = args[0];
start(projectName)
