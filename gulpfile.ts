import {
	task, watch,
	src, dest,
	series, parallel
} from 'gulp';

import * as del from 'del';

import * as sass from 'gulp-sass';
import * as rename from 'gulp-rename';
import { init as mapInit, write as mapWrite } from 'gulp-sourcemaps';

import {
	init as serverInit,
	watch as serverWatch,
	reload as serverReload
} from 'browser-sync';

const SRC_DIR = 'src/';
const DST_DIR = 'dist/';

const PATH = {
	html: {
		source_dir: SRC_DIR + '',
		source_files: SRC_DIR + '*.html',
		dst_dir: DST_DIR
	},
	script: {
		dst_dir: DST_DIR + 'script'
	},
	style: {
		dst_dir: DST_DIR + 'style'
	},
	assets: {
		source_dir: SRC_DIR + 'assets/',
		source_files: SRC_DIR + 'assets/**/*.*',
		dst_dir: DST_DIR + 'assets/'
	},
	module: {
		source_dir: SRC_DIR + 'modules/',
		jquery: 'node_modules/jquery/dist/jquery.min.js',
		bootstrapScript: 'node_modules/bootstrap/dist/js/bootstrap.min.js',
		bootstrapStyle: SRC_DIR + 'modules/bootstrap.scss',
		dst_dir: DST_DIR + 'modules'
	}
}

// generate html
function compilePages() {
	return src(PATH.html.source_files)
		.pipe(dest(PATH.html.dst_dir));
}

// add frameworks
let addFrameworks = parallel(addJQuery, addBootstrapScript, addBootstrapStyle);
function addJQuery() {
	return src(PATH.module.jquery)
		.pipe(dest(PATH.module.dst_dir));
}

function addBootstrapScript() {
	return src(PATH.module.bootstrapScript)
		.pipe(dest(PATH.module.dst_dir));
}
function addBootstrapStyle() {
	return src(PATH.module.bootstrapStyle)
		.pipe(mapInit())
		.pipe(sass({
			outputStyle: 'compressed'
		}).on('error', sass.logError))
		.pipe(rename({ suffix: '.min'}))
		.pipe(mapWrite('.'))
		.pipe(dest(PATH.module.dst_dir));
}

// copy assets
function copyAssets() {
	return src(PATH.assets.source_files)
		.pipe(dest(PATH.assets.dst_dir));
}

// run server
function serve() {
	serverInit({
		server: {
			baseDir: DST_DIR
		},
		ghostMode: false,
		open: false,
		reloadDelay: 300
	});
	serverWatch(DST_DIR + '**/*.*').on('change', serverReload);
}

// run watcher
function watchFiles() {
	watch(PATH.html.source_files, compilePages);
	watch([PATH.module.bootstrapStyle, PATH.module.source_dir + '_bootstrap/**/*.*'], addBootstrapStyle);
}


// make tasks
task('clear', () => { return del(DST_DIR) });
task('build', series('clear', parallel(compilePages, addFrameworks, copyAssets)));
task('serve', serve);
task('dev', series('build', parallel(serve, watchFiles)));
