// Odpalenie - gulp build

const { watch, src, dest, series, parallel } = require("gulp");
const browserSync = require("browser-sync").create();
const babel = require("gulp-babel");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify-es").default;
const rename = require("gulp-rename");
const del = require("del");
const postcss = require("gulp-postcss");
const sass = require("gulp-sass");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");

const config = {
  app: {
    js: [
      // "./dev/js/jquery-3.4.1.min.js",
      "./dev/js/lib/*.js",
      "./dev/js/script.js",
    ],
    scss: "./dev/sass/*.scss",
    html: "./dev/*.html",
  },
  dist: {
    base: "./",
    js: "./js/",
    css: "./css/",
    html: "./",
  },
};

const watchconfig = {
  app: {
    js: ["./dev/js/**/*.js"],
    scss: "./dev/sass/**/*.scss",
    html: "./dev/*.html",
  },
  dist: {
    base: "./assets/",
  },
};

function jsTask(done) {
  src(config.app.js)
    .pipe(concat("script.min.js"))
    .pipe(uglify())
    .pipe(dest(config.dist.js));
  done();
}

function cssTask(done) {
  src(config.app.scss)
    .pipe(sass({ outputStyle: "expanded" }))
    .pipe(rename({ suffix: ".min" }))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(dest(config.dist.css));
  done();
}

function templateTask(done) {
  src(config.app.html).pipe(dest(config.dist.html));
  done();
}

function watchFiles() {
  watch(config.app.js, series(jsTask, reload));
  watch(watchconfig.app.scss, series(cssTask, reload));
  watch(config.app.html, series(templateTask, reload));
}

function liveReload(done) {
  browserSync.init({
    proxy: "",
    // server: {
    //   baseDir: config.dist.html,
    // },
  });
  done();
}

function reload(done) {
  browserSync.reload();
  done();
}

function cleanUp() {
  return del([config.dist.base]);
}

exports.build = parallel(jsTask, cssTask, templateTask, watchFiles);
