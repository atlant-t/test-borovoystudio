import {
	task, watch,
	src, dest,
	series, parallel
} from 'gulp';

import * as del from 'del';

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
	font: {
		dst_dir: DST_DIR + 'font'
	},
	module: {
		jquery: 'node_modules/jquery/dist/jquery.min.js',
		bootstrapScript: 'node_modules/bootstrap/dist/js/bootstrap.min.js',
		bootstrapStyle: 'node_modules/bootstrap/dist/css/bootstrap.min.css',
		bootstrapFont: 'node_modules/bootstrap/dist/css/bootstrap.min.css'
	}
}

// generate html
function compilePages() {
	return src(PATH.html.source_files)
		.pipe(dest(PATH.html.dst_dir));
}

// add frameworks
let addFrameworks = parallel(addJQuery, addBootstrapScript, addBootstrapStyle, addBootstrapFont);
function addJQuery() {
	return src(PATH.module.jquery)
		.pipe(dest(PATH.script.dst_dir));
}

function addBootstrapScript() {
	return src(PATH.module.bootstrapScript)
		.pipe(dest(PATH.script.dst_dir));
}
function addBootstrapStyle() {
	return src(PATH.module.bootstrapStyle)
		.pipe(dest(PATH.style.dst_dir));
}
function addBootstrapFont() {
	return src(PATH.module.bootstrapFont)
		.pipe(dest(PATH.font.dst_dir));
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
}


// make tasks
task('clear', () => { return del(DST_DIR) });
task('build', series('clear', parallel(compilePages, addFrameworks)));
task('serve', serve);
task('dev', series('build', parallel(serve, watchFiles)));
