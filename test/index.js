require('should');
var lmr = require('../index.js');

describe('lmr', function () {
    it('should do something', function () {
        var baz = lmr('baz');
        baz.value.should.equal('baz');
        var bar = lmr('foo/bar');
        bar.value.should.equal('real-bar');
    });
});
