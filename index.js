'use strict';

var fs = require('fs');
var path = require('path');

var CONFIG_FILE_NAME = '.lmr.json';

var cwd = process.cwd();
var defaultConfig = {
    root: cwd,
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

/**
 * Looks for a config file in the fs. It starts from the startDirName and makes it's way up to the root folder.
 *
 * @param {String} startDirName The folder from which to begin the search
 * @returns {String|undefined} Absolute path to the config file, or undefined if no file was found.
 */
function getConfigFilePath(startDirName) {
    var currDirName = startDirName;
    var prevDirName = '';
    // look for config up to the fs root. The FS root resolved to '..' returns the FS root,
    // hence the condition for the while loop
    while (currDirName !== prevDirName) {
        var configFilePath = path.join(currDirName, CONFIG_FILE_NAME);

        if (fs.existsSync(configFilePath)) {
            return configFilePath;
        }

        prevDirName = currDirName;
        currDirName = path.resolve(currDirName, '..');
    }
}

/**
 * Reads the config file and builds a Config object.
 *
 * @param {String} filePath Path to the config file.
 * @returns {Config}
 */
function parseConfigFile(filePath) {
    var configDirectory = path.dirname(filePath);
    var rawConfig = JSON.parse(fs.readFileSync(filePath));
    var result = {};

    // Select lmr root directory. If this property is not present in the config, use the directory of the config file
    result.root = rawConfig.root ?
        path.resolve(configDirectory, rawConfig.root) :
        configDirectory;

    // Resolve the path of the aliases depending, relative to the root directory
    result.aliases = rawConfig.aliases ?
        rawConfig.aliases.map(function (rawAlias) {
            return {
                value: path.normalize(rawAlias.value + path.sep),
                path: path.resolve(result.root, rawAlias.path)
            };
        }) :
        [];

    return result;
}

var configFilePath = getConfigFilePath(cwd);

/**
 * Module's configuration. Built on the first run.
 *
 * @type {Config}
 */
var config = configFilePath ?
    parseConfigFile(configFilePath) :
    defaultConfig;

/**
 * Local module require
 *
 * @param {String} modulePath Relative path from the root/ or relative path from an alias.
 * @returns {*} Whatever the module exports
 */
function lmr(modulePath) {
    if (!modulePath || typeof modulePath !== 'string') {
        throw new Error('The argument of lmr should be a string');
    }

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
