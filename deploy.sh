#!/bin/bash

# exit with nonzero exit code if anything fails
set -xe

if [ $TRAVIS_BRANCH == 'master' ] ; then
  echo "==> DEPLOY TO ZOMBIE"
  # start an ssh-agent session
  eval "$(ssh-agent -s)"
  #  adds the default keys ~/.ssh/id_rsa into the SSH authentication agent for implementing single sign-on with SSH
  ssh-add
  npm run build:prod
  rsync -rq --delete --rsync-path="mkdir -p ~/www/zombie/ && rsync" $TRAVIS_BUILD_DIR/\"$WALLET_DIST_FOLDER\"/. \"$DEV_PATH_DESTINY\"
else
  echo "==> Not deploying, since this branch isn't master."
fi
