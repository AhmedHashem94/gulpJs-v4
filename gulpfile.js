/* jshint esversion : 6 */
const { src, dest, parallel, task, watch, series } = require("gulp");
const scss = require("gulp-sass");
const notify = require("gulp-notify");
const autoprefixer = require("gulp-autoprefixer");
const minifyCSS = require("gulp-csso");
const concat = require("gulp-concat");
const browserSync = require("browser-sync").create();

function browser_sync() {
  browserSync.init({
    server: {
      baseDir: "./build/"
    }
  });
}

function reload(done) {
  browserSync.reload();
  done();
}

function html(done) {
  src("src/*.html")
    .pipe(dest("build/"))
    .pipe(notify("HTML"))
    .pipe(browserSync.stream());
  done();
}

function css(done) {
  src("src/scss/*.scss")
    .pipe(scss())
    .pipe(concat("main.css"))
    .pipe(minifyCSS())
    .pipe(
      autoprefixer({
        browsers: ["last 2 versions"],
        cascade: false
      })
    )
    .pipe(dest("build/css"))
    .pipe(notify("CSS"))
    .pipe(browserSync.stream());
  done();
}

function images() {
  src("src/imgs")
    .pipe(imagemin())
    .pipe(dest("build/imgs"));
}

function fonts() {
  src("src/webfonts").pipe(dest("build/webfonts"));
}

function js(done) {
  src("src/js/*.js", {
    sourcemaps: true
  })
    .pipe(concat("main.js"))
    .pipe(
      dest("build/js", {
        sourcemaps: true
      })
    )
    .pipe(notify("JS"))
    .pipe(browserSync.stream());
  done();
}

function watch_files() {
  watch("./src/*.html", series(html, reload));
  watch("./src/scss/*.scss", series(css, reload));
  watch("./src/js/*.js", series(js, reload));
}

task("html", html);
task("css", css);
task("js", js);
task("images", images);
task("fonts", fonts);
task("default", parallel(css, js, html));
task("watch", parallel(browser_sync, watch_files));
