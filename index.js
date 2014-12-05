'use strict';

var fs = require('fs');
var path = require('path');

var CONFIG_FILE_NAME = '.lmr.js';
var pwd = process.env.PWD;
var defaultConfig = {
    root: pwd,
    aliases: []
};

/**
 * Describes a directory alias to be used in the require section
 *
 * @typedef {Object} AliasEntry
 * @property {String} value
 * @property {String} path
 */

/**
 * Structure of the config object
 *
 * @typedef {Object} Config
 * @property {String} root
 * @property {AliasEntry[]} aliases
 */

// 1.look for config
function getConfigFilePath(startDirName) {
    var dirNames = startDirName.split(path.sep);
    for (var i = dirNames.length - 1; i >= 0; i--) {
        var currDirName = startDirName.split(dirNames[i])[0];
        var configFilePath = path.join(currDirName, CONFIG_FILE_NAME);
        if (fs.existsSync(configFilePath)) {
            return configFilePath;
        }
    }
}

function parseConfigFile(filePath) {
    var configDirectory = path.dirname(filePath);
    var rawConfig = require(filePath);
    var result = {};

    // Select lmr root directory. If this property is not present in the config, use the directory of the config file
    result.root = rawConfig.root ?
        path.resolve(configDirectory, rawConfig.root) :
        configDirectory;

    // Resolve the path of the aliases depending, relative to the root directory
    result.aliases = rawConfig.aliases ?
        path.resolve(result.root, rawConfig.aliases) :
        [];

    return result;
}

var configFilePath = getConfigFilePath(pwd);
var config = configFilePath ?
    parseConfigFile(configFilePath) :
    defaultConfig;

function lmr(modulePath) {
    // check for alias matches
    var aliasMatch = config.aliases.filter(function (alias) {
        return modulePath.indexOf(alias.value) === 0;
    })[0];

    // if a match was found, use it's path instead of the root
    var fullModulePath = aliasMatch ?
        path.resolve(aliasMatch.path, modulePath.substr(aliasMatch.value.length)) :
        path.resolve(config.root, modulePath);

    return require(fullModulePath);
}

module.exports = lmr;
