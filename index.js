'use strict';

var PWD = process.env.PWD;
var root = PWD + '/';

// 1.look for config
// 2.determine root
// 3.build aliases

function lmr(modulePath) {
    // resolve module path
    // look for module in aliases
    //    if present return the required moduel
    //    if not present require from the fs
    //    if not present in aliases and fs throw error
    return require(root + modulePath);
}

module.exports = lmr;
