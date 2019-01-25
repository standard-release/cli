# @standard-release/cli [![npm version][npmv-img]][npmv-url] [![github release][ghrelease-img]][ghrelease-url] [![License][license-img]][license-url]

> Publish new project to NPM following Conventional Commits specification and SemVer. Uses [git-commits-since][] for detecting git commits since last SemVer tag and [detect-next-version][] for what next version bump should be.

Please consider following this project's author, [Charlike Mike Reagent](https://github.com/tunnckoCore), and :star: the project to show your :heart: and support.

<div id="thetop"></div>

[![Code style][codestyle-img]][codestyle-url]
[![CircleCI linux build][linuxbuild-img]][linuxbuild-url]
[![CodeCov coverage status][codecoverage-img]][codecoverage-url]
[![DavidDM dependency status][dependencies-img]][dependencies-url]
[![Renovate App Status][renovateapp-img]][renovateapp-url]
[![Make A Pull Request][prs-welcome-img]][prs-welcome-url]
[![Semantically Released][standard-release-img]][standard-release-url]

If you have any _how-to_ kind of questions, please read the [Contributing Guide](./CONTRIBUTING.md) and [Code of Conduct](./CODE_OF_CONDUCT.md) documents.  
For bugs reports and feature requests, [please create an issue][open-issue-url] or ping
[@tunnckoCore](https://twitter.com/tunnckoCore) at Twitter.

[![Become a Patron][patreon-img]][patreon-url]
[![Conventional Commits][ccommits-img]][ccommits-url]
[![Spectrum community][spectrum-community-img]][spectrum-community-url]
[![NPM Downloads Monthly][downloads-monthly-img]][npmv-url]
[![NPM Downloads Total][downloads-total-img]][npmv-url]
[![Share Love Tweet][shareb]][shareu]

Project is [semantically](https://semver.org) versioned & automatically released through [CircleCI](https://circleci.com) with [Standard Release][standard-release-url].

<!-- Logo when needed:

<p align="center">
  <a href="https://github.com/standard-release/cli">
    <img src="./media/logo.png" width="85%">
  </a>
</p>

-->

## Table of Contents

- [Install](#install)
- [CLI](#cli)
- [API](#api)
- [See Also](#see-also)
- [Contributing](#contributing)
  * [Guides and Community](#guides-and-community)
  * [Support the project](#support-the-project)
  * [OPEN Open Source](#open-open-source)
  * [Wonderful Contributors](#wonderful-contributors)
- [License](#license)

_(TOC generated by [verb](https://github.com/verbose/verb) using [markdown-toc](https://github.com/jonschlinkert/markdown-toc))_

## Install

This project requires [**Node.js**](https://nodejs.org) **^8.10.0 || >=10.13.0** _(see [Support & Release Policy](https://github.com/tunnckoCoreLabs/support-release-policy))_. Install it using
[**yarn**](https://yarnpkg.com) or [**npm**](https://npmjs.com).  
_We highly recommend to use Yarn when you think to contribute to this project._

```bash
$ yarn global add @standard-release/cli
```

## CLI

Just run `standard-release` and that's it!
It will detect next needed bump for your package and execute `npm version` and `npm publish`.

Make note that it is meant to be used in CI services, but if you want to run it locally pass
the `--no-ci` flag, otherwise it will exit the program.

```
Usage:
  stanard-release [flags]

Flags:
  --ci          to be called on CI or locally; default: true
  --dry         dry run, won't publish; it will output metadata
  --cwd         a directory where the package.json is; default: process.cwd()
  --token       a npm token to be used, or pass NPM_TOKEN env
  --registry    a npm registry to be published to, or pass NPM_REGISTRY env

```

## API

<!-- docks-start -->
_Generated using [docks](http://npm.im/docks)._

<!-- docks-end -->

**[back to top](#thetop)**

## See Also

Some of these projects are used here or were inspiration for this one, others are just related. So, thanks for your existance!

- [@tunnckocore/create-project](https://www.npmjs.com/package/@tunnckocore/create-project): Create and scaffold a new project, its GitHub repository and… [more](https://github.com/tunnckoCoreLabs/create-project) | [homepage](https://github.com/tunnckoCoreLabs/create-project "Create and scaffold a new project, its GitHub repository and contents")
- [@tunnckocore/execa](https://www.npmjs.com/package/@tunnckocore/execa): Thin layer on top of [execa][] that allows executing multiple… [more](https://github.com/tunnckoCoreLabs/execa) | [homepage](https://github.com/tunnckoCoreLabs/execa "Thin layer on top of [execa][] that allows executing multiple commands in parallel or in sequence")
- [@tunnckocore/scripts](https://www.npmjs.com/package/@tunnckocore/scripts): Universal and minimalist scripts & tasks runner. | [homepage](https://github.com/tunnckoCoreLabs/scripts "Universal and minimalist scripts & tasks runner.")
- [asia](https://www.npmjs.com/package/asia): Blazingly fast, magical and minimalist testing framework, for Today and… [more](https://github.com/olstenlarck/asia#readme) | [homepage](https://github.com/olstenlarck/asia#readme "Blazingly fast, magical and minimalist testing framework, for Today and Tomorrow")
- [detect-next-version](https://www.npmjs.com/package/detect-next-version): Calculates next version, based on given commit message and following… [more](https://github.com/tunnckoCoreLabs/detect-next-version) | [homepage](https://github.com/tunnckoCoreLabs/detect-next-version "Calculates next version, based on given commit message and following Conventional Commits")
- [docks](https://www.npmjs.com/package/docks): Extensible system for parsing and generating documentation. It just freaking… [more](https://github.com/tunnckoCore/docks) | [homepage](https://github.com/tunnckoCore/docks "Extensible system for parsing and generating documentation. It just freaking works!")
- [git-commits-since](https://www.npmjs.com/package/git-commits-since): Get all commits since given period of time or by… [more](https://github.com/tunnckoCoreLabs/git-commits-since) | [homepage](https://github.com/tunnckoCoreLabs/git-commits-since "Get all commits since given period of time or by default from latest git semver tag. Understands and follows both SemVer and the Conventional Commits specification.")

**[back to top](#thetop)**

## Contributing

### Guides and Community

Please read the [Contributing Guide](./CONTRIBUTING.md) and [Code of Conduct](./CODE_OF_CONDUCT.md) documents for advices.

For bug reports and feature requests, please join our [Spectrum community][spectrum-community-url] forum and open a thread there with prefixing the title of the thread with the name of the project if there's no separate channel for it.

Consider reading the [Support and Release Policy](https://github.com/tunnckoCoreLabs/support-release-policy) guide if you are interested in what are the supported Node.js versions and how we proceed. In short, we support latest two even-numbered Node.js release lines.

### Support the project

[Become a Partner or Sponsor?][patreon-url] :dollar: Check the **Partner**, **Sponsor** or **Omega-level** tiers! :tada: You can get your company logo, link & name on this file. It's also rendered on package page in [npmjs.com][npmv-url] and [yarnpkg.com](https://yarnpkg.com/en/package/@standard-release/cli) sites too! :rocket:

Not financial support? Okey! [Pull requests](https://github.com/tunnckoCoreLabs/contributing#opening-a-pull-request), stars and all kind of [contributions](https://opensource.guide/how-to-contribute/#what-it-means-to-contribute) are always
welcome. :sparkles:

### OPEN Open Source

This project is following [OPEN Open Source](http://openopensource.org) model

> Individuals making significant and valuable contributions are given commit-access to the project to contribute as they see fit. This project is built on collective efforts and it's not strongly guarded by its founders.

There are a few basic ground-rules for its contributors

1. Any **significant modifications** must be subject to a pull request to get feedback from other contributors.
2. [Pull requests](https://github.com/tunnckoCoreLabs/contributing#opening-a-pull-request) to get feedback are _encouraged_ for any other trivial contributions, but are not required.
3. Contributors should attempt to adhere to the prevailing code-style and development workflow.

### Wonderful Contributors

Thanks to the hard work of these wonderful people this project is alive! It follows the
[all-contributors](https://github.com/kentcdodds/all-contributors) specification.  
Don't hesitate to add yourself to that list if you have made any contribution! ;) [See how,
here](https://github.com/jfmengels/all-contributors-cli#usage).

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars3.githubusercontent.com/u/5038030?v=4" width="120px;"/><br /><sub><b>Charlike Mike Reagent</b></sub>](https://tunnckocore.com)<br />[💻](https://github.com/standard-release/cli/commits?author=tunnckoCore "Code") [📖](https://github.com/standard-release/cli/commits?author=tunnckoCore "Documentation") [💬](#question-tunnckoCore "Answering Questions") [👀](#review-tunnckoCore "Reviewed Pull Requests") [🔍](#fundingFinding-tunnckoCore "Funding Finding") |
| :---: |

<!-- ALL-CONTRIBUTORS-LIST:END -->

Consider showing your [support](#support-the-project) to them. :sparkling_heart:

## License

Copyright (c) 2018-present, [Charlike Mike Reagent](https://tunnckocore.com) `<mameto2011@gmail.com>` & [contributors](#wonderful-contributors).  
Released under the [Apache-2.0 License][license-url].

<!-- Heading badges -->

[npmv-url]: https://www.npmjs.com/package/@standard-release/cli
[npmv-img]: https://badgen.net/npm/v/@standard-release/cli?icon=npm

[ghrelease-url]: https://github.com/standard-release/cli/releases/latest
[ghrelease-img]: https://badgen.net/github/release/standard-release/cli?icon=github
[license-url]: https://github.com/standard-release/cli/blob/master/LICENSE

[license-img]: https://badgen.net/npm/license/@standard-release/cli

<!-- Front line badges -->

[codestyle-url]: https://github.com/airbnb/javascript
[codestyle-img]: https://badgen.net/badge/code%20style/airbnb/ff5a5f?icon=airbnb
[linuxbuild-url]: https://circleci.com/gh/standard-release/cli/tree/master
[linuxbuild-img]: https://badgen.net/circleci/github/standard-release/cli/master?label=build&icon=circleci
[codecoverage-url]: https://codecov.io/gh/standard-release/cli
[codecoverage-img]: https://badgen.net/codecov/c/github/standard-release/cli?icon=codecov
[dependencies-url]: https://david-dm.org/standard-release/cli
[dependencies-img]: https://badgen.net/david/dep/standard-release/cli?label=deps
[ccommits-url]: https://conventionalcommits.org/
[ccommits-img]: https://badgen.net/badge/conventional%20commits/v1.0.0/dfb317
[standard-release-url]: https://github.com/standard-release/standard-release
[standard-release-img]: https://badgen.net/badge/semantically/released/05c5ff
[spectrum-community-img]: https://badgen.net/badge/spectrum/community/7b16ff
[spectrum-community-url]: https://spectrum.chat/tunnckoCore

[downloads-weekly-img]: https://badgen.net/npm/dw/@standard-release/cli
[downloads-monthly-img]: https://badgen.net/npm/dm/@standard-release/cli
[downloads-total-img]: https://badgen.net/npm/dt/@standard-release/cli

[renovateapp-url]: https://renovatebot.com
[renovateapp-img]: https://badgen.net/badge/renovate/enabled/green
[prs-welcome-img]: https://badgen.net/badge/PRs/welcome/green
[prs-welcome-url]: http://makeapullrequest.com
[paypal-donate-url]: https://paypal.me/tunnckoCore/10
[paypal-donate-img]: https://badgen.net/badge/$/support/purple
[patreon-url]: https://www.patreon.com/bePatron?u=5579781
[patreon-img]: https://badgen.net/badge/patreon/tunnckoCore/F96854?icon=patreon
[patreon-sponsor-img]: https://badgen.net/badge/become/a%20sponsor/F96854?icon=patreon
[shareu]: https://twitter.com/intent/tweet?text=https://github.com/standard-release/cli&via=tunnckoCore
[shareb]: https://badgen.net/badge/twitter/share/1da1f2?icon=twitter
[open-issue-url]: https://github.com/standard-release/cli/issues/new

[detect-next-version]: https://github.com/tunnckoCoreLabs/detect-next-version
[execa]: https://github.com/sindresorhus/execa
[git-commits-since]: https://github.com/tunnckoCoreLabs/git-commits-since
[new-release]: https://github.com/tunnckoCoreLabs/new-release