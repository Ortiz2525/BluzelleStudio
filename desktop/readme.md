Electron packaging always runs into the same errors that you can mitigate by following this checklist.

1. Make sure app is working (run `yarn start`)
2. Add all dependencies to the `package.json` in **this** directory. (`electron-packager` does not search higher directories for dependencies like `npx`)
3. Ensure any symlinks (such as `emulator` in `bluzelle-js`) are not broken when moved into `node_modules`. 


4. The error "Package "..." refers to a non-existing file" can be resolved by removing the `--package-manager=yarn` flag.