let fileswatch = 'htm,txt,json,md,woff2' // List of files extensions for watching & hard reload

const { src, dest, parallel, series, watch } = require('gulp')
const browserSync  = require('browser-sync').create()
const webpack      = require('webpack-stream')
const sass         = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const rename       = require('gulp-rename')
const imagemin     = require('gulp-imagemin')
const newer        = require('gulp-newer')
const rsync        = require('gulp-rsync')
const del          = require('del')
// Tailwind
const postcss = require('gulp-postcss');
const tailwindcss = require('tailwindcss');
const cssnano = require('cssnano');
const purgecss = require('@fullhuman/postcss-purgecss');
const tailwindConfig = require('./tailwind.config.js');
const concatCss = require('gulp-concat-css');
// Pug 
const plumber = require('gulp-plumber')
const pug = require('gulp-pug')
const pugLinter = require('gulp-pug-linter')
const htmlValidator = require('gulp-w3c-html-validator')
//const bemValidator = require('gulp-html-bem-validator')

function browsersync() {
	browserSync.init({
		server: { baseDir: 'app/' },
		notify: false,
		online: true
	})
}


function pug2html() {
  return src('app/pages/*.pug')
    .pipe(plumber())
    .pipe(pugLinter({ reporter: 'default' }))
    .pipe(pug({ pretty: true }))
    // .pipe(htmlValidator())
    .pipe(dest('app/'))
}

function scripts() {
	return src('app/js/app.js')
	.pipe(webpack({
		mode: 'production',
		module: {
			rules: [
				{
					test: /\.(js)$/,
					exclude: /(node_modules)/,
					loader: 'babel-loader',
					query: {
						presets: ['@babel/env']
					}
				}
			]
		}
	})).on('error', function handleError() {
		this.emit('end')
	})
	.pipe(rename('app.min.js'))
	.pipe(dest('app/js'))
	.pipe(browserSync.stream())
}

function styles() {
	const plugins = [
		tailwindcss(tailwindConfig),
		
    	purgecss({ 
			content: [' app/*.html', 'app/js/app.min.js'], 
			safelist: [
				'section-nav__nav--open',
				'md:text-white',
				'md:text-black', 
				'md:justify-start',
				'md:justify-end',
				'owl-stage-outer ',
				'owl-height',
				'md:row-span-1',
				'md:row-span-2',
				'md:row-span-3',
				'md:row-span-4',
				'md:row-span-5',
				'md:row-span-6',
				'md:col-span-1',
				'md:col-span-2',
				'md:col-span-3',
				'md:col-span-4',
				'md:col-span-5',
				'md:col-span-6',
				'md:grid-cols-1',
				'md:grid-cols-2',
				'md:grid-cols-3',
				'md:grid-cols-4',
				'md:grid-cols-5',
				'md:grid-cols-8',
				'md:grid-cols-9',
				'md:grid-cols-10',
				'md:grid-cols-11',
				'md:grid-cols-12',
				'md:text-center'
				
			]}),
			cssnano(),
	];
	return src('app/sass/main.sass')
	.pipe(sass())
	.pipe(postcss(plugins))
	.pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
	.pipe(rename('app.min.css'))
	// .pipe(concatCss('/node_modules/owl.carousel/dist/assets/owl.carousel'))
	.pipe(dest('app/css'))
	.pipe(browserSync.stream())
}

function stylesBuid() {
	const plugins = [
		tailwindcss(),
		cssnano(),
    	purgecss({content: ['app/*.html']})
	];
	return src('app/sass/main.sass')
	.pipe(sass())
	.pipe(postcss(plugins))
	.pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
	.pipe(rename('app.min.css'))
	.pipe(dest('app/css'))
	.pipe(browserSync.stream())
}

function images() {
	return src('app/img/src/**/*')
	.pipe(newer('app/img/dest'))
	.pipe(imagemin([
		imagemin.mozjpeg({quality: 90, progressive: true}),
	]))
	.pipe(dest('app/img/dest'))
}
function cleanimg() {
	return del('app/img/dist/**/*', { force: true })
}

function deploy() {
	return src('app/')
	.pipe(rsync({
		root: 'app/',
		hostname: 'username@yousite.com',
		destination: 'yousite/public_html/',
		include: [/* '*.htaccess' */], // Included files to deploy,
		exclude: [ '**/Thumbs.db', '**/*.DS_Store' ],
		recursive: true,
		archive: true,
		silent: false,
		compress: true
	}))
}

function startwatch() {
	watch('app/sass/**/*', { usePolling: true }, styles)
	watch('app/pages/**/*.pug', { usePolling: true }, pug2html).on('change', browserSync.reload)
	watch(['app/js/**/*.js', '!app/js/**/*.min.js'], { usePolling: true }, scripts)
	watch('app/img/src/**/*.{jpg,jpeg,png,webp,svg,gif}', { usePolling: true }, images)
	watch(`app/**/*.{${fileswatch}}`, { usePolling: true }).on('change', browserSync.reload)
}

exports.assets   = series(cleanimg, scripts, images)
exports.scripts  = scripts
exports.styles   = styles
exports.images   = images
exports.cleanimg = cleanimg
exports.deploy   = deploy
exports.default  = series(pug2html ,scripts, images, styles, parallel(browsersync, startwatch))
