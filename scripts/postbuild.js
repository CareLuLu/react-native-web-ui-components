const fs = require('fs');
const path = require('path');

fs
  .readdirSync(path.resolve(__dirname, '..', 'dist'))
  .filter(dir => (dir.indexOf('.') < 0))
  .forEach((dir) => {
    fs.writeFileSync(
      path.resolve(__dirname, '..', 'dist', `${dir.toLowerCase()}.js`),
      `import ${dir} from './${dir}';\nexport default ${dir};`,
    );
  });
