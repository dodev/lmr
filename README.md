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

The simplest use case is just using LMR as a tool to require relative to your project root.

Install it:
```
npm i lrm
```

And use it out of the box:
```javascript
var lmr = require('lmr');
var HashMap = lmr('app/lib/HashMap');

var cache = new HashMap();
...
```

How It Works
===
The implementation is fairly simple - when required for the first time, lmr determines the root directory of your project and then resolves the aliases relatively to the root.

When the lmr function is called with the name of the required module, it first looks if the name contains an alias. If so, an absolute path to the alias folder is built. If not, the name is resolved relative to the root directory. The resulting path is passed to the native nodejs require, which does all the work for reading, returning what the module has to provide or throwing an error if nothing was found in this path.

Config Syntax
===

###The Root
The `root` property, how you've already figured out, specifies the path, relative to which the paths are resolved.
If it wasn't specified the root of the configuration is considered the directory in which the configuration file placed. If there is no configuration file, then the process current working directory is used as root.

###Aliases
Aliases provide a mechanism for giving more intuitive names for specific directories. Their path should be relative to the root directory of the lmr configration.

A Real World Example
===
Actually LMR is designed to solve more complicated tasks than the quick start example. Consider a project with the following file structure:
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
    |-client/
    |-server/

```
The most obvious shortcoming from requiring relatively to the project's root is that for all server modules, the path will begin with `'server/'`. Also it would be helpful to refer explicitly to the current configs. Another helpful abstraction would be if you could access your `server/` modules from the `test/server/` like their were placed under one directory.

LMR gives the developer the ability to describe his virtual module structure declaratively. The above problems are solved with the following configuration file, named `.lmr.json` and  placed in the root of the project:
```json
{
    "root": "server/",
    "aliases": {
        "config": "../config/current/"
    }
}
```

So now if you want to refer to `/server/lib/Analyzer` from any point in your project you can do it consistently throught out your modules:
```javascript
var Analyzer = lmr('lib/Analyzer');
```

The current configuration files will be available under the `config` alias:
```javascript
var hostsConfig = lmr('confg/hosts');
```

How To Contribute
===
Recommendations and bug-reports are received warmly @ [github](https://github.com/dodev/lmr/issues).

If you want to get your hands dirty:

1) Fork the [repository](https://github.com/dodev/lmr/fork).
2) Apply your changes. Be sure to checkout the project's [codestyle](https://github.com/yandex/codestyle/blob/master/javascript.md)
3) Make sure the lint and test pass:
```
npm run-script lint && npm run-script test
```
4) Send a pull request.

TODO
===
* Path - module cache.
* More tests.
* Continuous integration.

License
===
MIT
