'use strict';

const winston = require('winston');
const config = require('config').logger;
const fs = require('fs');
const path = require('path');

const { Logger, transports: { File, Console } } = winston;

fs.existsSync(config.directory) || fs.mkdirSync(config.directory);

module.exports = new Logger({
    transports: [
        new Console(),
        new File({
            name: 'info-file',
            filename: path.join(config.directory, 'info.log'),
            level: 'info'
        }),
        new File({
            name: 'error-file',
            filename: path.join(config.directory, 'error.log'),
            level: 'error'
        })
    ]
});