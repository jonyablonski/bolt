# bolt
Bolt is a simple project boilerplate that prioritizes performance, accessibility, and progressive enhancement.

[Download Bolt](https://github.com/jmy1138/bolt/archive/master.zip)

## Features
* Robust task-automation powered by [Gulp](http://gulpjs.com/)
* Powerful HTML templating via [Nunjucks](https://mozilla.github.io/nunjucks/)
* Fast CSS pre-processing via [LibSass](http://sass-lang.com/libsass)
* Feature-rich SVG workflow via [Gulp-SVG-Sprite](https://github.com/jkphl/gulp-svg-sprite)
* Critical CSS feature via [Critical](https://github.com/addyosmani/critical)

## Quick start
Clone the git repo — `git clone https://github.com/jmy1138/bolt.git`

## Getting Started
1. In bash/terminal/command line, `cd` into your project directory.
2. Run `npm install` to install required files.
3. When it's done installing, run one of the task runners to get going:
 * `gulp` manually compiles files.
 * `gulp watch` automatically compiles files and applies changes using [BrowserSync](https://www.browsersync.io/).
 * `gulp build` compiles files into 'dist' directory.
 * `gulp critical` processes html files in 'dist' directory and replaces them with files that include inline CSS to render above-the-fold content quickly, the asynchronously loads the full CSS file.

### Dependencies
Make sure these are installed first.

* [Node.js](http://nodejs.org)
* [Gulp](http://gulpjs.com) `sudo npm install -g gulp`

## License
The code is available under the [MIT license](LICENSE.txt).
