#!/bin/bash
set -xe
  npm run build:prod
  rsync -rq --delete --rsync-path="mkdir -p ~/www/test/ && rsync" \
  $TRAVIS_BUILD_DIR/dist travis@138.68.71.197:~/www/test/