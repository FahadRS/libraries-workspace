'use strict';

const execa = require('execa');
const fs = require('fs-extra');
const src = 'projects/ng-core';
const dist = 'dist';
const buildPkgJson = require('ngm-cli/tasks/npm/build-pkg-json.task');

async function buildAll() {
  console.log("In Build all method");

  // const {stdout} = await execa('echo', ['unicorns']);
	// console.log(stdout);

  if (!fs.existsSync(dist)) {
    fs.mkdirSync(dist);
  }

  await buildPkgJson.buildPkgJson({ src, dist });
  //await execa.command(`json -I -f ${dist}/package.json -e 'this.schematics="./schematics/collection.json"'`);
  //cpy(['*.md', 'LICENSE'], dist);

  //await execa.shell(`npm run link`);

  const requiredModules = ['models' , 'services'];

  await buildModules(requiredModules);

  //await execa.shell(`rsync -avr  --include='*/' --include='*.scss' --exclude='*' ${src}/datepicker ${dist}`);
}

buildAll();

async function buildModules(modules) {

  for (let module of modules) {
    console.log('Building', module, 'module');    
    await execa.command(`node scripts/ng-packagr/api ../../projects/ng-core/src/${module}/package.json`);

  
    await execa.command(`npm run dist-to-modules.windows`);  
    console.log(`Build of ${module} module completed`);

  }
}
