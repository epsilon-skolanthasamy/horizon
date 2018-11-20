/******************************************************
 * PATTERN LAB NODE
 * EDITION-NODE-GULP
 * The gulp wrapper around patternlab-node core, providing tasks to interact with the core library and move supporting frontend assets.
******************************************************/
var gulp = require('gulp'),
  path = require('path'),
  browserSync = require('browser-sync').create(),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  concat = require('gulp-concat'),
  greplace = require('gulp-replace'),
  argv = require('minimist')(process.argv.slice(2));

function resolvePath(pathInput) {
  return path.resolve(pathInput).replace(/\\/g,"/");
}

/******************************************************
 * COPY TASKS - stream assets from source to destination
******************************************************/
// JS copy
gulp.task('pl-copy:js', function(){
  gulp.src('**/*.js', {cwd: resolvePath(paths().source.js)} )
    .pipe(gulp.dest(resolvePath(paths().public.js)));

  return gulp.src(config.jsBootstrapValidator)
    .pipe(gulp.dest(path.resolve(paths().public.js)));
});

// Images copy
gulp.task('pl-copy:img', function(){
  return gulp.src('**/*.*',{cwd: resolvePath(paths().source.images)} )
    .pipe(gulp.dest(resolvePath(paths().public.images)));
});

// Media copy
gulp.task('pl-copy:media', function(){
  return gulp.src('**/*.*',{cwd: resolvePath(paths().source.media)} )
    .pipe(gulp.dest(resolvePath(paths().public.media)));
});

// Favicon copy
gulp.task('pl-copy:favicon', function(){
  return gulp.src('favicon.ico', {cwd: resolvePath(paths().source.root)} )
    .pipe(gulp.dest(resolvePath(paths().public.root)));
});

// Fonts copy
gulp.task('pl-copy:font', function(){
  return gulp.src('*', {cwd: resolvePath(paths().source.fonts)})
    .pipe(gulp.dest(resolvePath(paths().public.fonts)));
});

// font-awesome Fonts copy
gulp.task('pl-copy:font-awesome', function(){
  return gulp.src('*', {cwd: config.FontAwesomeFiles})
    .pipe(gulp.dest(resolvePath(paths().public.fonts)));
});

// SASS Compilation - compiles the .scss from source css location
// and copies to public css folder.
 gulp.task('pl-sass', function(){
 return gulp.src(path.resolve(paths().source.css, '**/*.scss'))
   .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
   .pipe(autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
   .pipe(gulp.dest(path.resolve(paths().public.css)));
});

// Build bootstrap JS files
  gulp.task('pl-bootstrap-js', function() {
    return gulp.src(config.jsBootstrapFiles)
    .pipe(concat('bootstrap.js'))
    .pipe(gulp.dest(path.resolve(paths().public.js)));
  });

// CSS Copy
gulp.task('pl-copy:css', function(){
  return gulp.src(resolvePath(paths().source.css) + '/*.css')
    .pipe(gulp.dest(resolvePath(paths().public.css)))
    .pipe(browserSync.stream());
});

// Styleguide Copy everything but css
gulp.task('pl-copy:styleguide', function(){
  return gulp.src(resolvePath(paths().source.styleguide) + '/**/!(*.css)')
    .pipe(gulp.dest(resolvePath(paths().public.root)))
    .pipe(browserSync.stream());
});

// Styleguide Copy and flatten css
gulp.task('pl-copy:styleguide-css', function(){
  return gulp.src(resolvePath(paths().source.styleguide) + '/**/*.css')
    .pipe(gulp.dest(function(file){
      //flatten anything inside the styleguide into a single output dir per http://stackoverflow.com/a/34317320/1790362
      file.path = path.join(file.base, path.basename(file.path));
      return resolvePath(path.join(paths().public.styleguide, '/css'));
    }))
    .pipe(browserSync.stream());
});

// Post Process public html.
// This task replaces '</body>' in public html files with
// a script and closing body tag. This script is needed because patternlab specifies
// only width of iframe and it is not supported in iOS device. Thus causing
// issues while testing the pages on iOS devices. This is only a change in
// patternlab output html, but doesn't have impact on actual components developed.
// This seems to be a good way of making this change without editing patternlab files
// so we don't lose this change if we update patternlab in future.
var scriptText = '<script type="text/javascript">' +
  'function adjustFrameScrolling() {' +
    'if(navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {' +
      '$("#sg-viewport").attr("scrolling", "no");' +
    '}' +
  '}' +
  'adjustFrameScrolling();' +
'</script> </body>';

gulp.task('pl-html-post-process', function(){
  return gulp.src(paths().public.root + 'index.html')
    .pipe(greplace('</body>', scriptText))
    .pipe(gulp.dest(resolvePath(paths().public.root)));
});

/******************************************************
 * PATTERN LAB CONFIGURATION - API with core library
******************************************************/
//read all paths from our namespaced config file
var config = require('./patternlab-config.json'),
  patternlab = require('patternlab-node')(config);

config['jsBootstrapValidator'] = './node_modules/bootstrap-validator/dist/validator.min.js';
config['jsBootstrapFiles'] = [
  // bootstrap js files to concatenate
  './node_modules/bootstrap/js/src/collapse.js'
];

// Font awesome fonts location
config['FontAwesomeFiles'] = './source/fontawesome-pro-5.2.0-web/webfonts';

function paths() {
  return config.paths;
}

function getConfiguredCleanOption() {
  return config.cleanPublic;
}

function build(done) {
  patternlab.build(done, getConfiguredCleanOption());
}

gulp.task('pl-assets', gulp.series(
  gulp.parallel(
    'pl-bootstrap-js',
    'pl-copy:js',
    'pl-copy:img',
    'pl-copy:media',
    'pl-copy:favicon',
    'pl-copy:font',
    'pl-copy:font-awesome',
    'pl-sass',
    'pl-copy:css',
    'pl-copy:styleguide',
    'pl-copy:styleguide-css'
  ),
  function(done){
    done();
  })
);

gulp.task('patternlab:version', function (done) {
  patternlab.version();
  done();
});

gulp.task('patternlab:help', function (done) {
  patternlab.help();
  done();
});

gulp.task('patternlab:patternsonly', function (done) {
  patternlab.patternsonly(done, getConfiguredCleanOption());
});

gulp.task('patternlab:liststarterkits', function (done) {
  patternlab.liststarterkits();
  done();
});

gulp.task('patternlab:loadstarterkit', function (done) {
  patternlab.loadstarterkit(argv.kit, argv.clean);
  done();
});

gulp.task('patternlab:build', gulp.series('pl-assets', build, 'pl-html-post-process', function(done){
  done();
}));

gulp.task('patternlab:installplugin', function (done) {
  patternlab.installplugin(argv.plugin);
  done();
});

/******************************************************
 * SERVER AND WATCH TASKS
******************************************************/
// watch task utility functions
function getSupportedTemplateExtensions() {
  var engines = require('./node_modules/patternlab-node/core/lib/pattern_engines');
  return engines.getSupportedFileExtensions();
}
function getTemplateWatches() {
  return getSupportedTemplateExtensions().map(function (dotExtension) {
    return resolvePath(paths().source.patterns) + '/**/*' + dotExtension;
  });
}

function reload() {
  browserSync.reload();
}

function reloadCSS() {
  browserSync.reload('*.css');
}

function watch() {
  gulp.watch(path.resolve(paths().source.css, '**/*.scss')).on('change', gulp.series('pl-sass'));
  gulp.watch(resolvePath(paths().source.css) + '/**/*.css', { awaitWriteFinish: true }).on('change', gulp.series('pl-copy:css', reloadCSS));
  gulp.watch(resolvePath(paths().source.styleguide) + '/**/*.*', { awaitWriteFinish: true }).on('change', gulp.series('pl-copy:styleguide', 'pl-copy:styleguide-css', reloadCSS));
  gulp.watch(resolvePath(paths().source.js) + '/**/*.js', { awaitWriteFinish: true }).on('change', gulp.series('pl-copy:js'));

  var patternWatches = [
    resolvePath(paths().source.patterns) + '/**/*.json',
    resolvePath(paths().source.patterns) + '/**/*.md',
    resolvePath(paths().source.data) + '/*.json',
    resolvePath(paths().source.fonts) + '/*',
    resolvePath(paths().source.images) + '/*',
    resolvePath(paths().source.meta) + '/*',
    resolvePath(paths().source.annotations) + '/*'
  ].concat(getTemplateWatches());

  console.log(patternWatches);

  gulp.watch(patternWatches, { awaitWriteFinish: true }).on('change', gulp.series(build, reload));
}

gulp.task('patternlab:connect', gulp.series(function(done) {
  browserSync.init({
    server: {
      baseDir: resolvePath(paths().public.root)
    },
    snippetOptions: {
      // Ignore all HTML files within the templates folder
      blacklist: ['/index.html', '/', '/?*']
    },
    notify: {
      styles: [
        'display: none',
        'padding: 15px',
        'font-family: sans-serif',
        'position: fixed',
        'font-size: 1em',
        'z-index: 9999',
        'bottom: 0px',
        'right: 0px',
        'border-top-left-radius: 5px',
        'background-color: #1B2032',
        'opacity: 0.4',
        'margin: 0',
        'color: white',
        'text-align: center'
      ]
    }
  }, function(){
    console.log('PATTERN LAB NODE WATCHING FOR CHANGES');
    done();
  });
}));

/******************************************************
 * COMPOUND TASKS
******************************************************/
gulp.task('default', gulp.series('patternlab:build'));
gulp.task('patternlab:watch', gulp.series('patternlab:build', watch));
gulp.task('patternlab:serve', gulp.series('patternlab:build', 'patternlab:connect', watch));
