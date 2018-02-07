'use strict';

// TODO: Move this to an npm script.
process.env.NODE_PATH = process.env.NODE_PATH || `${__dirname};${__dirname}/srv`;
require('module').Module._initPaths();

require('srv');
