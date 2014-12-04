require('should');
var lmr = require('../index.js');

describe('lmr', function () {
    it('should do something', function () {
        var baz = lmr('test/baz');
        baz.value.should.equal('baz');
    });
});
