Electron packaging always runs into the same errors that you can mitigate by following this checklist.

1. Make sure app is working (run `yarn start`)
2. Add all dependencies to the `package.json` in **this** directory. (`electron-packager` does not search higher directories for dependencies like node would)
3. The error "Package "..." refers to a non-existing file" is resolved by not having any "file:..." dependencies in `package.json`. For each "file:..." dependency, manually copy the source directory into `node_modules` here, and remove it temporarily from `package.json`. 
4. Run `yarn package-mac/windows/linux`.