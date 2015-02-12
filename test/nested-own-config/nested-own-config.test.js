require('should');
var lmr = require('../../index.js');

describe('local module require from a nested folder with own config', function () {
    it('should require files relative to the root folder of the config file', function () {
        var baz = lmr('baz');
        baz.value.should.equal('baz');
        var bar = lmr('foo/bar');
        bar.value.should.equal('real-bar');
    });

    it('should require files from a folder alias', function () {
        var fubar = lmr('fu/bar');
        fubar.value.should.equal('fubar');
    });
});
