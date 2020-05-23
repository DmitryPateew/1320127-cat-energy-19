"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var less = require("gulp-less");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var csso=require("gulp-csso");
var rename =require("gulp-rename");
var imagemin=require("gulp-imagemin");
var webp=require("gulp-webp");
var posthtml=require("gulp-posthtml");
var include=require("posthtml-include");

gulp.task("css", function () {
  return gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("source/css"))
    .pipe(server.stream());
});

gulp.task("server", function () {
  server.init({
    server: "source/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/less/**/*.less", gulp.series("css"));
  gulp.watch("source/*.html").on("change", server.reload);
});

gulp.task("images", function () {
return gulp.src("source/img/**/*.{png,jpg,svg}")
  .pipe(imagemin([
   imagemin.optipng({optimizationLevel:3}),
    imagemin.jpegtran({progressive:true}),
    imagemin.svgo()
  ]))
  .pipe(gulp.dest("source/min-img"));
});

gulp.task("webp", function () {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(webp({quality:90}))
    .pipe(gulp.dest("source/min-img"));
});

gulp.task("sprite", function () {
return gulp.src("source/img/**/*.svg")
  .pipe(svgstore({
    inlineSvg:true
  }))
  .pipe(rename("sprite.svg"))
  .pipe(gulp.dest("source/min-img"));
});

gulp.task("sprite", function () {
  return gulp.src("source/*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest("source/min-img"));
});

gulp.task("copy",function(){
  return gulp.src("source/**/*")
    .pipe(gulp.dest("source/build"));
});

gulp.task("build", gulp.series("css","copy"));
gulp.task("start", gulp.series("build", "server"));
