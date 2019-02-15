#!/bin/bash

# exit with nonzero exit code if anything fails
set -xe
if [ $TRAVIS_BRANCH == 'master' ] ; then
  echo "==> DEPLOY TO ZOMBIE"
  eval "$(ssh-agent -s)"
  ssh-add
  npm run build:prod
  rsync -rq --delete --rsync-path="mkdir -p ~/www/zombie/ && rsync" \
  $TRAVIS_BUILD_DIR/public travis@138.68.71.197:~/www/zombie/
else
  echo "==> Not deploying, since this branch isn't master."
fi
