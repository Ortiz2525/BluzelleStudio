#!/bin/bash

cd desktop
npm install


# Mac packaging

npm run package-mac
cd dist/bluzelle-crud-darwin-x64
tar czf ${PACKAGE_NAME_OSX} *
echo ${TRAVIS_BRANCH}
travis_retry curl -u${REPO_USER}:${REPO_PASSWORD} -T ${PACKAGE_NAME_OSX} "https://bluzelle.jfrog.io/bluzelle/OSX/${PACKAGE_NAME_OSX}"
cd ../..


# Linux packaging

npm run package-linux
brew install fakeroot dpkg
npm run package-deb -- --options.version ${PROJECT_VERSION}
travis_retry curl -u${REPO_USER}:${REPO_PASSWORD} -XPUT "https://bluzelle.jfrog.io/bluzelle/debian-local/pool/${PACKAGE_NAME_DEB};deb.distribution=all;deb.component=stable;deb.architecture=${PACKAGE_ARCHITECTURE}" -T dist/*.deb