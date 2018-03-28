var downloadGitRepo = require('download-git-repo');
var colors = require('colors');
var { spawn, exec } = require('child_process');
var fs = require('fs');

var template = '';
var projectName = 'new project';
var templateRepository = 'i-zxl/vuex-axios-demo';
var temp = '.vuex-axios-demo';



var command = function (cmd) {
  return new Promise(function (resolve, reject) {
    exec(cmd, function (error, stdout, stderr) {
      error ? reject(error) : resolve(stdout);
    });
  });
}

// clear exist template
var clean = function () {
  if (fs.existsSync(temp)) {
    return command('rm -r ' + temp)
  } else {
    return Promise.resolve();
  }
}
// download repo
var download = function () {
  console.log('start download template...')
  return new Promise(function (resolve, reject) {
    downloadGitRepo(templateRepository, temp, { clone: false }, function (err) {
      console.log('err', err)
      console.log('download finish...')
      err ? reject(err) : resolve();
    })
  })
}
// copy files
var setup = function () {
  console.log('start setup...')
  var cmd = `cp -r ${temp} ${projectName}`;

  var packagePath = `${temp}/package.json`;
  var packageContent = fs.readFileSync(packagePath, 'utf-8')
  packageContent = packageContent.replace(/\$PROJECT_NAME/g, projectName);
  fs.writeFileSync(packagePath, packageContent);

  var processPath = `${temp}/processes.json`;
  var processContent = fs.readFileSync(processPath, 'utf-8')
  processContent = processContent.replace(/\$PROJECT_NAME/g, projectName);
  fs.writeFileSync(processPath, processContent);

  console.log('setup...finish')
  return command(cmd);
}
var installDependencies = function () {
  console.log('start install cnpm package...')
  var cmd = `cd ${projectName};cnpm install; cd ..`;
  return command(cmd).then(function (stdout) {
    console.log(stdout);
  });
}
// install finish
var finish = function () {
  var l = function () {console.log.apply(console, arguments)};
  l(colors.green('---- Install Finish ----'));
  l(colors.white(`How to start your project:`));
  l(colors.green(`    cd ${projectName}`));
  l(colors.green(`    npm run dev`));
}

//download()
module.exports = function (name) {
  projectName = name;
  clean()
    .then(download)
    .then(setup)
    .then(installDependencies)
    .then(clean)
    .then(finish)
    .catch(function (err) {
      console.log('Error:', err)
    })
}
