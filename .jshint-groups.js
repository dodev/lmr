module.exports = {
    options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        noempty: true,
        nonew: true,
        undef: true,
        unused: true,
        trailing: true,
        maxlen: 120,
        quotmark: 'single'
    },
    groups: {
        lib: {
            options: {
                node: true
            },
            includes: [
                'index.js'
            ]
        },

        test: {
            options: {
                node: true,
                predef: [
                    'describe',
                    'it',
                    'before',
                    'beforeEach',
                    'after',
                    'afterEach'
                ],
                expr: true // for should asserts
            },
            includes: [
                'test/*.js'
            ]
        }
    }
};
