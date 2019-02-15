#!/bin/bash
set -xe

if [ $TRAVIS_BRANCH == 'master' ] ; then
  eval "$(ssh-agent -s)"
  ssh-add
  npm run build:prod
  rsync -rq --delete --rsync-path="mkdir -p ~/www/test/ && rsync" \
  $TRAVIS_BUILD_DIR/dist travis@138.68.71.197:~/www/test/
else
  echo "Not deploying, since this branch isn't master."
fi
