#BEEP PLUGIN

###Install
```
npm install webpack-beep-plugin

// In webpack config file
 var BeepPlugin = require('webpack-beep-plugin');
 plugins: [new BeepPlugin()] 
```

Then just run webpack with a --beep argument.

NOTE: for webpack v2 use --env.beep.  Webpack v2 does not allow custom arguments without the 'env.' prefix
