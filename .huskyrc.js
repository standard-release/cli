'use strict';

module.exports = {
  hooks: {
    'commit-msg': 'echo $HUSKY_GIT_PARAMS',
  },
};
