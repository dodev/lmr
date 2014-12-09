LMR
===
*Local Module Require. Now configurable and supporting aliases.*

A simple tool abstracting your module files of where they are in the file system.

There a lot of known solutions to the '../../../' problem. Some of them are discussed [here](https://gist.github.com/branneman/8048520).

This problem was solved in other npm-packages:

* [rekuire](https://www.npmjs.org/package/rekuire)
* [loquire](https://www.npmjs.org/package/loquire)

Those solutions might be quick to implement and perfectly work for small projects. LMR is aimed at serving in large applications, with ever-growing file structure.

What LMR has to offer, besides requiring relatively to the root of the project, is the ability to configure the root directory and a handy alias system.

Quick Start
===

The simplest use case is just using LMR as a tool to require relative to your project root:
Install it:
```
npm i lrm
```

And use it out of the box:
```javascript
var lmr = require('lmr');
var overridenRequest = lmr('app/overrides/request');
```

A Real World Example
===
LMR solves more complicated tasks. Consider a project with the following file structure:
```
/
  |-build/        // build targets
  |-client/
  |-config/       // projects configs - used both in the front- and back-end
  | |-current@    // a symlink to the current enviroment
  | |-prod/
  | |-dev/
  | |-test/
  |
  |-node_modules/ // service folder for npm modules. IMHO it's not a good place to store one's local modules.
  |
  |-server/
  | |-lib/        // local project packages
  | |-middleware/ // express.js middleware
  | |-override/   // overrides and extensions for some of the framework's entities
  | |-util/       // simple project-specific utilities
  |
  |-test/         // a centralized tests' forlder
  | |-client/
  | |-server/

```
The most obvious shortcoming from requiring relatively to the project's root is that for all server modules, the path will begin with 'server/'. Also it would be helpful to refer only to the current configs only, i.e. only using the config files referred by the `config/current` symlink. Also you may want to access your `server/` modules from the `test/server/` like their were placed in a single directory.

Luckily for you LMR has the solution to your needs - a configuration file. The above problems are solved with the following configuration file, named `.lmr.js` and  placed in the root of the project:
```javascript
module.exports = {
    root: 'server/',
    aliases: [
        {
            value: 'config',
            path: '../config/current/'
        },
        {
            value: 'build',
            path: '../build/'
        }
    ]
};
```

So now if you want to refer to `/server/lib/Analyzer` from any point in your project you can do it consistently:
```javascript
var Analyzer = lmr('lib/Analyzer');
```

The current configuration files will be available under the `config` alias:
```javascript
var hostsConfig = lmr('confg/hosts');
```

TODO
===
* Extend this doc.
* Path - module cache.
* More tests.
* Continuous integration.

License
===
MIT
