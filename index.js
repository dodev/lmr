'use strict';

var fs = require('fs');
var path = require('path');

var CONFIG_FILE_NAME = '.lmr.js';
var pwd = process.env.PWD;
var root = pwd;
var defaultConfig = {
    root: pwd,
    aliases: []
};

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
    var rawConfig = require(filePath);
    var result = {};
// 2.determine root
    result.root = rawConfig.root ?
        rawConfig.root : // TODO: resolve the path to absolute
        pwd;
// 3.build aliases
    result.aliases = rawConfig.aliases ?
        rawConfig.aliases : // TODO: concatenate root and aliases path
        [];

    return result;
}

var configFilePath = getConfigFilePath(pwd);
var config = configFilePath ?
    parseConfigFile(configFilePath) :
    defaultConfig;

function lmr(modulePath) {
    // check for aliases
    var aliasMatches = config.aliases.filter(function (alias) {
        return modulePath.indexOf(alias.alias) === 0;
    });

    var moduleDirectoryPath = aliasMatches.length > 0 ?
        aliasMatches[0].path : // TODO: remove the alias from the modulePath
        config.root;

    // resolve module path
    // look for module in aliases
    //    if present return the required module
    //    if not present require from the fs

    return require(path.join(moduleDirectoryPath, modulePath));
}

module.exports = lmr;
