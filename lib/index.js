const downloadGitRepo = require('download-git-repo');
const colors = require('colors');
const { spawn, exec } = require('child_process');
const fs = require('fs');

let template = '';
let projectName = 'Project';
const templateRepository = 'i-zxl/schoolBus';
const temp = '.schoolBus';
const fakeProjectNameFiles = ['package.json', 'processes.json']

const command = (cmd) => {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      error ? reject(error) : resolve(stdout);
    });
  });
}

const log = (...args) => { console.log.apply(console, args) }

const clean = () => fs.existsSync(temp) ? command('rm -r ' + temp) : Promise.resolve()

const download = () => {
  log('start download template...')
  return new Promise((resolve, reject) => {
    downloadGitRepo(templateRepository, temp, { clone: false }, (err) => {
      log('download finish...')
      err ? reject(err) : resolve();
    })
  })
}

const setup = () => {
  log('start setup...')
  let cmd = `cp -r ${temp} ${projectName}`;
  fakeProjectNameFiles.forEach((file) => {
    let filePath = `${temp}/${file}`
    if (fs.existsSync(filePath)) {
      let packageContent = fs.readFileSync(filePath, 'utf-8').replace(/\$PROJECT_NAME/g, projectName)
      fs.writeFileSync(filePath, packageContent);
    }
  })
  log('setup...finish')
  return command(cmd);
}

const installDependencies = () => {
  log('start install package...')
  let cmd = `cd ${projectName}; cnpm install; cd ..`
  return command(cmd).then(function (stdout) { log(stdout) })
}

const finish = () => {
  log(colors.green('---- Install Finish ----'))
  log(colors.yellow(`How to start your project:`))
  log(colors.red(`cd ${projectName}`))
  log(colors.red(`npm run dev`))
}

//download()
module.exports = (name) => {
  projectName = name
  clean()
    .then(download)
    .then(setup)
    .then(installDependencies)
    .then(clean)
    .then(finish)
    .catch(err => log('Error:', err))
}
