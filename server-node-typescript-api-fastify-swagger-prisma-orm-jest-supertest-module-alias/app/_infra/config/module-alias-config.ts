import moduleAlias from 'module-alias';
import aliases from '../../../aliases.json';

function registerModuleAlias() {
  console.log('--- registerModuleAlias | begin ---');
  console.log('__dirname:', __dirname);
  const app = __dirname.substring(0, __dirname.indexOf('/app') + 4);
  console.log('app:', app);
  aliases.forEach((alias) => {
    const aliasName = alias.tsconfig.alias.replace('/*', '');
    const aliasPath = alias.tsconfig.path.replace('./app', app).replace('*', '');
    console.log('aliasPath:', aliasPath);
    moduleAlias.addAlias(aliasName, aliasPath);
  });
  console.log('--- registerModuleAlias | end ---');
}

registerModuleAlias();
