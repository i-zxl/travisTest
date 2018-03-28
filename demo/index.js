var start = require('../lib/index');

var args = [].slice.call(process.argv, 2);

if (args.length === 0) {
  console.log('missing arguments: yd-cli ${projectName}');
  return process.exit();
}
var projectName = args[0];

console.log(projectName)

start(projectName)
