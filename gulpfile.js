require('events').EventEmitter.prototype._maxListeners = 100;

var gulp = require('gulp'),
    pug = require('gulp-pug'),
    sass = require('gulp-sass'),
	minifyCss = require('gulp-minify-css'),
	minify = require('gulp-minify'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),	
	streamqueue  = require('streamqueue'),
	image  = require('gulp-image'),
	connect = require('gulp-connect'),
	jasmine = require('gulp-jasmine'),
	notify = require('gulp-notify'),
	flatten = require('gulp-flatten'),
	i18n = require('gulp-html-i18n'),
	clean = require('gulp-clean'),
	modRewrite = require('connect-modrewrite'),
	fs = require('fs'),
	proxy = require('http-proxy-middleware'),
	express = require('express'),
	pathBundles = 'app/bundles/src',
	pathPlugins = 'app/plugins',
	pathPublic = 'app/public',
	pathBuild = 'app/build',
	sitesDefined=[];
	
var path = {
	
    sitesBundles: [pathBundles + '/sites/**/*.pug'],
	sitesPlugins: [pathPlugins + '/sites/**/*.pug'],

    localeBundles: [pathBundles + '/sites/**/locale/**/*.*'],
	
	sitesDeploy: [pathBuild+'/sites/**/*.pug'],
    sitesBuild: pathBuild + '/sites/',
	sitesPublic: pathPublic + '/',
	
	pugBundlesLayouts: [pathBundles + '/layouts/**/*.pug'],
	pugPluginsLayouts: [pathPlugins + '/layouts/**/*.pug'],

	pugBundlesComponents: [pathBundles + '/components/**/**/**/*.*'],
	pugPluginsComponents: [pathPlugins + '/components/**/**/**/*.*'],
	
	localeBundlesComponents: [pathBundles + '/components/**/locale/**/*.*'],
	localePluginsComponents: [pathPlugins + '/components/**/locale/**/*.*'],

	pugBundlesFragments: [pathBundles + '/fragments/**/**/**/*.*'],
	pugPluginsFragments: [pathPlugins + '/fragments/**/**/**/*.*'],	
	
};

var langs = ['es','en'];

getSitesBundles();
getSitesPlugins();


var taskCSSBuild = [],
	taskJSBuild = [],
	taskIMAGESBuild = [],
	taskTEMPLATESBuild = [],
	taskLAYOUTSBuild = [],
	taskCOMPONENTSBuild = [],
	taskFRAGMENTSBuild = [],
	taskLOCALESBuild = [];
	taskLOCALES_COMPONENTSBuild = [];

for (var key in sitesDefined){
	
/**********************************CSS*************************************/	
    createTaskCSSBundles(sitesDefined[key].site,sitesDefined[key].theme,sitesDefined[key].themeParent);
    createTaskCSSPlugins(sitesDefined[key].site,sitesDefined[key].theme,sitesDefined[key].themeParent);
    taskCSSBuild.push('cssBundles' + sitesDefined[key].site);
    taskCSSBuild.push('cssPlugins' + sitesDefined[key].site);
	
/**********************************JS*************************************/	

    createTaskJSBundles(sitesDefined[key].site,sitesDefined[key].theme,sitesDefined[key].themeParent);
    createTaskJSPlugins(sitesDefined[key].site,sitesDefined[key].theme,sitesDefined[key].themeParent);
    taskJSBuild.push('jsBundles' + sitesDefined[key].site);
    taskJSBuild.push('jsPlugins' + sitesDefined[key].site);	
	
/**********************************IMAGES*************************************/	

    createTaskIMAGESBundles(sitesDefined[key].site,sitesDefined[key].theme,sitesDefined[key].themeParent);
    createTaskIMAGESPlugins(sitesDefined[key].site,sitesDefined[key].theme,sitesDefined[key].themeParent);
    taskIMAGESBuild.push('imagesBundles' + sitesDefined[key].site);
    taskIMAGESBuild.push('imagesPlugins' + sitesDefined[key].site);

/**********************************TEMPLATES*************************************/

    createTaskTEMPLATESBundles(sitesDefined[key].site,sitesDefined[key].theme,sitesDefined[key].themeParent);
    createTaskTEMPLATESPlugins(sitesDefined[key].site,sitesDefined[key].theme,sitesDefined[key].themeParent);
    taskTEMPLATESBuild.push('templatesBundles' + sitesDefined[key].site);
    taskTEMPLATESBuild.push('templatesPlugins' + sitesDefined[key].site);
	
/************************************LAYOUTS**************************************/

    createTaskLAYOUTSBundles(sitesDefined[key].site);
    createTaskLAYOUTSPlugins(sitesDefined[key].site);
    taskLAYOUTSBuild.push('layoutsBundles' + sitesDefined[key].site);
    taskLAYOUTSBuild.push('layoutsPlugins' + sitesDefined[key].site);	
	
/************************************COMPONENTS**************************************/	

    createTaskCOMPONENTSBundles(sitesDefined[key].site);
    createTaskCOMPONENTSPlugins(sitesDefined[key].site);
    taskCOMPONENTSBuild.push('componentsBundles' + sitesDefined[key].site);
    taskCOMPONENTSBuild.push('componentsPlugins' + sitesDefined[key].site);


/************************************FRAGMENTS**************************************/	

    createTaskFRAGMENTSBundles(sitesDefined[key].site);
    createTaskFRAGMENTSPlugins(sitesDefined[key].site);
    taskFRAGMENTSBuild.push('fragmentsBundles' + sitesDefined[key].site);
    taskFRAGMENTSBuild.push('fragmentsPlugins' + sitesDefined[key].site);    
	
/************************************LOCALES**************************************/	

    createTaskLOCALESBundles(sitesDefined[key].site);
    createTaskLOCALESPlugins(sitesDefined[key].site);
    taskLOCALESBuild.push('localesBundles' + sitesDefined[key].site);
    taskLOCALESBuild.push('localesPlugins' + sitesDefined[key].site);	
	
    createTaskLOCALES_COMPONENTSBundles(sitesDefined[key].site);
    createTaskLOCALES_COMPONENTSPlugins(sitesDefined[key].site);
    taskLOCALES_COMPONENTSBuild.push('localesComponentsBundles' + sitesDefined[key].site);
    taskLOCALES_COMPONENTSBuild.push('localesComponentsPlugins' + sitesDefined[key].site);	
	
}

gulp.task('sitesBundles', function() {
    return gulp.src(path.sitesBundles)
    .pipe(gulp.dest(path.sitesBuild))
});

gulp.task('sitesPlugins',['sitesBundles'], function() {
    return gulp.src(path.sitesPlugins)
    .pipe(gulp.dest(path.sitesBuild))
});

/** THEME TASK **/
gulp.task('cssBuild', taskCSSBuild);

gulp.task('jsBuild', taskJSBuild);

gulp.task('imagesBuild', taskIMAGESBuild);

gulp.task('templatesBuild', taskTEMPLATESBuild);


/** BUILD TASKS **/
gulp.task('themesBuild', ['cssBuild','jsBuild','templatesBuild','imagesBuild']);

gulp.task('layoutsBuild', taskLAYOUTSBuild);

gulp.task('componentsBuild', taskCOMPONENTSBuild);

gulp.task('fragmentsBuild', taskFRAGMENTSBuild);

gulp.task('sitesBuild', ['sitesBundles','sitesPlugins']);

gulp.task('localesBuild', taskLOCALESBuild);

gulp.task('localesComponentsBuild', taskLOCALES_COMPONENTSBuild);



/** BUILD **/
gulp.task('build', ['sitesBuild','localesBuild','localesComponentsBuild','layoutsBuild','componentsBuild','fragmentsBuild','themesBuild']);

/** CSS DEPLOY TASK **/
gulp.task('cssTheme',['cssBuild'], function() {
	for (var key in sitesDefined){	
		var files = gulp.src(pathBuild + '/sites/' + sitesDefined[key].site + '/theme/css/main.scss')
			.pipe(sass().on('error', sass.logError))
			.pipe(concat('main.css'))
			.pipe(rename({
				basename: 'main',
				extname: '.min.css'
			}))
			.pipe(minifyCss({
				keepSpecialComments: 0
			}));
	
		for (var lang in langs){
			files.pipe(gulp.dest(pathPublic + '/sites/' + sitesDefined[key].site + '/' + langs[lang] + '/css/'));
		}
	}

	return true;	
});

gulp.task('cssComponents',['componentsBuild'], function() {
	for (var key in sitesDefined){	
		var files = gulp.src(pathBuild + '/sites/' + sitesDefined[key].site + '/components/**/[^_]*.scss')
			.pipe(sass().on('error', sass.logError))
			.pipe(concat('components.css'))
			.pipe(rename({
				basename: 'components',
				extname: '.min.css'
			}))
			.pipe(minifyCss({
				keepSpecialComments: 0
			}));
			

		for (var lang in langs){
			files.pipe(gulp.dest(pathPublic + '/sites/' + sitesDefined[key].site + '/' + langs[lang] + '/css/'));
		}			
	}

	return true;		
});

gulp.task('fonts',['cssBuild'], function() {
	for (var key in sitesDefined){	
		
		var files = gulp.src(pathBuild + '/sites/' + sitesDefined[key].site + '/theme/css/fonts/**/*.*');

		for (var lang in langs){
			files.pipe(gulp.dest(pathPublic + '/sites/' + sitesDefined[key].site + '/' + langs[lang] + '/css/fonts/'))
		}				
	}

	return true;		
});


/** JS DEPLOY TASKS **/
gulp.task('jsTheme',['jsBuild'], function() {  
	for (var key in sitesDefined){
		var files = streamqueue({ objectMode: true },
			gulp.src(pathBuild + '/sites/' + sitesDefined[key].site + '/theme/javascript/primaryLibs/**/[^_]*.js'),
			gulp.src(pathBuild + '/sites/' + sitesDefined[key].site + '/theme/javascript/libs/**/[^_]*.js'),
			gulp.src(pathBuild + '/sites/' + sitesDefined[key].site + '/theme/javascript/[^_]*.js')
		);

		for (var lang in langs){
			files.pipe(concat('main.js'))
			.pipe(gulp.dest(pathPublic + '/sites/' + sitesDefined[key].site + '/' + langs[lang] + '/javascript/'))
			.pipe(rename('main.min.js'))
			.pipe(uglify())
			.pipe(gulp.dest(pathPublic + '/sites/' + sitesDefined[key].site + '/' + langs[lang] + '/javascript/'));
		}	
	}

	return true;
});

gulp.task('jsComponents',['componentsBuild'], function() {  
    for (var key in sitesDefined){
		var files = streamqueue({ objectMode: true },
			gulp.src(pathBuild + '/sites/' + sitesDefined[key].site + '/components/**/[^_]*.js')
		);

		for (var lang in langs){
			files.pipe(concat('components.js'))
				.pipe(gulp.dest(pathPublic + '/sites/' + sitesDefined[key].site + '/' + langs[lang] + '/javascript/'))
			.pipe(rename('components.min.js'))
			.pipe(uglify())
				.pipe(gulp.dest(pathPublic + '/sites/' + sitesDefined[key].site + '/' + langs[lang] + '/javascript/'))
		}		
	}

	return true;		
});


/**DEPLOY TASKS**/
gulp.task('cssDeploy', ['cssTheme','cssComponents','fonts']);

gulp.task('jsDeploy', ['jsTheme','jsComponents']);

gulp.task('imagesDeploy',['imagesBuild'], function() {
	for (var key in sitesDefined){	
		var files = gulp.src(pathBuild + '/sites/' + sitesDefined[key].site + '/theme/images/**/*.*')
		  /*.pipe(image({
			  pngquant: true,
			  optipng: false,
			  zopflipng: true,
			  jpegRecompress: false,
			  jpegoptim: true,
			  mozjpeg: true,
			  gifsicle: true,
			  svgo: true,
			  concurrent: 10
			}))*/;

		for (var lang in langs){  
			files.pipe(gulp.dest(pathPublic + '/sites/' + sitesDefined[key].site + '/' + langs[lang] + '/images/'))
		}	
	}

	return true;		
});

gulp.task('sitesDeploy',['localesBuild','localesComponentsBuild','layoutsBuild','templatesBuild','componentsBuild','fragmentsBuild','sitesBuild'], function() {
	for (var key in sitesDefined){		
		
		var  pathSite='';

		if(sitesDefined[key].site == 'default'){
			pathSite = pathBundles;
		}
		else{
			pathSite = pathPlugins;
		}
		
		console.log(JSON.parse(fs.readFileSync(pathSite +'/sites/'+ sitesDefined[key].site +'/sitemap.json')));

		var files = gulp.src(pathBuild + '/sites/' + sitesDefined[key].site + '/*.pug')
		.pipe(pug({
			pretty: true,
			basedir: pathBuild + '/sites/' + sitesDefined[key].site,
			locals: JSON.parse(fs.readFileSync(pathSite +'/sites/'+ sitesDefined[key].site +'/sitemap.json'))
		}))
		.pipe(i18n({
		  langDir: pathBuild + '/sites/' + sitesDefined[key].site + '/locale',
		  createLangDirs: true,
		  defaultLang: 'es'
		}));


		return files.pipe(gulp.dest(pathPublic + '/sites/' + sitesDefined[key].site));
	}
});

/** DEPLOY **/
gulp.task('deploy', ['sitesDeploy','cssDeploy','jsDeploy','imagesDeploy'],function(){
	return gulp.start('removeTMP');
});

/** DEFAULT **/
gulp.task('default',['deploy','connect']);


/** CONNECT **/

gulp.task('connect', function() {
  connect.server({
	root: './app/public/sites/',
	middleware: function() {
	
		var rewriteRules = [];
		for (var key in sitesDefined){	
	
			var  pathSite='';

			if(sitesDefined[key].site == 'default'){
				pathSite = pathBundles;
			}
			else{
				pathSite = pathPlugins;
			}	
	
			var sitemap = JSON.parse(fs.readFileSync(pathSite +'/sites/'+ sitesDefined[key].site +'/sitemap.json'));
			var site = sitemap.site.url;	
			var pages = sitemap.pages;
			var urls = [];

			for (var lang in langs){
				rewriteRules.push('^/'+sitesDefined[key].site+ '/' + langs[lang] +'/css/(.*)$ /'+sitesDefined[key].site + '/' + langs[lang] +'/css/$1 [L]');
				rewriteRules.push('^/'+sitesDefined[key].site+ '/' + langs[lang] +'/images/(.*)$ /'+sitesDefined[key].site + '/' + langs[lang] +'/images/$1 [L]');
				rewriteRules.push('^/'+sitesDefined[key].site+ '/' + langs[lang] +'/javascript/(.*)$ /'+sitesDefined[key].site + '/' + langs[lang] +'/javascript/$1 [L]');
			}
				
			for(var i=0;i<pages.length;i++){
				urls = urls.concat(getURLs(pages[i],[]));
			}
			
			for(var i=0;i<urls.length;i++){
				for (var lang in langs){
					rewriteRules.push('^' + site + '/' + langs[lang] + urls[i].url + ' ' + site + '/' + langs[lang] + urls[i].src + ' [L]');
				}	
			}

		}

		rewriteRules = rewriteRules.sort(function(a, b){
		  // ASC  -> a.length - b.length
		  // DESC -> b.length - a.length
		  return b.length - a.length;
		});
		
				console.log(rewriteRules);
		return [
			modRewrite(rewriteRules)
		]	
	}	
  });
});


/** TESTING **/
gulp.task('test', function () {
  gulp.src('./tests/*.js')
    .pipe(jasmine())
    .on('error', notify.onError({
      title: 'Jasmine Test Failed',
      message: 'One or more tests failed, see the cli for details.'
    }));
});


gulp.task('removeTMP', function () {
  return gulp.src(pathPublic + '/sites/default/*.html', {read: false})
    .pipe(clean());

});



/**************************FUNCTIONS******************************/
function createTaskCSSBundles(siteName,siteTheme,siteParentTheme){
	gulp.task('cssBundles' + siteName, function() {
		return gulp.src(pathBundles + '/themes/' + siteParentTheme + '/css/**/*.*')
		.pipe(gulp.dest(pathBuild + '/sites/' + siteName + '/theme/css/'))
	});
}

function createTaskCSSPlugins(siteName,siteTheme,siteParentTheme){
	
	gulp.task('cssPlugins' + siteName,['cssBundles' + siteName], function() {
		return gulp.src(pathPlugins + '/themes/' + siteTheme + '/css/**/*.*')
		.pipe(gulp.dest(pathBuild + '/sites/' + siteName + '/theme/css/'))
	});
}

function createTaskJSBundles(siteName,siteTheme,siteParentTheme){
	gulp.task('jsBundles' + siteName, function() {
		return gulp.src(pathBundles + '/themes/' + siteParentTheme + '/javascript/**/[^_]*.js')
		.pipe(gulp.dest(pathBuild + '/sites/' + siteName + '/theme/javascript/'))
	});
}

function createTaskJSPlugins(siteName,siteTheme,siteParentTheme){
	
	gulp.task('jsPlugins' + siteName,['jsBundles' + siteName], function() {
		return 	gulp.src(pathPlugins + '/themes/' + siteTheme + '/javascript/**/[^_]*.js')
		.pipe(gulp.dest(pathBuild + '/sites/' + siteName + '/theme/javascript/'))
	});
}

function createTaskIMAGESBundles(siteName,siteTheme,siteParentTheme){
	gulp.task('imagesBundles' + siteName, function() {
		return gulp.src(pathBundles + '/themes/' + siteParentTheme + '/images/**/*.*')
		.pipe(gulp.dest(pathBuild + '/sites/' + siteName + '/theme/images/'))
	});
}

function createTaskIMAGESPlugins(siteName,siteTheme,siteParentTheme){
	
	gulp.task('imagesPlugins' + siteName,['imagesBundles' + siteName], function() {
		return 	gulp.src(pathPlugins + '/themes/' + siteTheme + '/images/**/*.*')
		.pipe(gulp.dest(pathBuild + '/sites/' + siteName + '/theme/images/'))
	});
}

function createTaskTEMPLATESBundles(siteName,siteTheme,siteParentTheme){
	gulp.task('templatesBundles' + siteName, function() {
		return gulp.src(pathBundles + '/themes/' + siteParentTheme + '/templates/**/*.pug')
		.pipe(gulp.dest(pathBuild + '/sites/' + siteName + '/theme/templates/'))
	});
}

function createTaskTEMPLATESPlugins(siteName,siteTheme,siteParentTheme){
	
	gulp.task('templatesPlugins' + siteName,['templatesBundles' + siteName], function() {
		return 	gulp.src(pathPlugins + '/themes/' + siteTheme + '/templates/**/*.pug')
		.pipe(gulp.dest(pathBuild + '/sites/' + siteName + '/theme/templates/'))
	});
}

function createTaskLAYOUTSBundles(siteName){
	gulp.task('layoutsBundles' + siteName, function() {
		return 	gulp.src(path.pugBundlesLayouts)
		.pipe(gulp.dest(pathBuild + '/sites/' + siteName + '/layouts/'))
	});
}

function createTaskLAYOUTSPlugins(siteName){
	
	gulp.task('layoutsPlugins' + siteName,['layoutsBundles' + siteName], function() {
		return 	gulp.src(path.pugPluginsLayouts)
		.pipe(gulp.dest(pathBuild + '/sites/' + siteName + '/layouts/'))
	});
}


function createTaskCOMPONENTSBundles(siteName){
	gulp.task('componentsBundles' + siteName, function() {
		return 	gulp.src(path.pugBundlesComponents)
		.pipe(gulp.dest(pathBuild + '/sites/' + siteName + '/components/'))
	});
}

function createTaskCOMPONENTSPlugins(siteName){
	
	gulp.task('componentsPlugins' + siteName,['componentsBundles' + siteName], function() {
		return 	gulp.src(path.pugPluginsComponents)
		.pipe(gulp.dest(pathBuild + '/sites/' + siteName + '/components/'))
	});
}

function createTaskFRAGMENTSBundles(siteName){
	gulp.task('fragmentsBundles' + siteName, function() {
		return 	gulp.src(path.pugBundlesFragments)
		.pipe(gulp.dest(pathBuild + '/sites/' + siteName + '/fragments/'))
	});
}

function createTaskFRAGMENTSPlugins(siteName){
	
	gulp.task('fragmentsPlugins' + siteName,['fragmentsBundles' + siteName], function() {
		return 	gulp.src(path.pugPluginsFragments)
		.pipe(gulp.dest(pathBuild + '/sites/' + siteName + '/fragments/'))
	});
}

function createTaskLOCALESBundles(siteName){
	gulp.task('localesBundles' + siteName, function() {
		return gulp.src(pathBundles + '/sites/' + siteName + '/locale/**/*.*')
		.pipe(flatten({ includeParents: -1}))
		.pipe(gulp.dest(pathBuild + '/sites/' + siteName + '/locale/'))
	});
}

function createTaskLOCALESPlugins(siteName){
	gulp.task('localesPlugins' + siteName,['localesBundles' + siteName], function() {
		return gulp.src(pathPlugins + '/sites/' + siteName + '/locale/**/*.*')
		.pipe(flatten({ includeParents: -1}))
		.pipe(gulp.dest(pathBuild + '/sites/' + siteName + '/locale/'))
	});
}

function createTaskLOCALES_COMPONENTSBundles(siteName){
	gulp.task('localesComponentsBundles' + siteName, function() {
		return 	gulp.src(path.localeBundlesComponents)
		.pipe(flatten({ includeParents: -1}))
		.pipe(gulp.dest(pathBuild + '/sites/' + siteName + '/locale/'))
	});
}

function createTaskLOCALES_COMPONENTSPlugins(siteName){
	gulp.task('localesComponentsPlugins' + siteName,['localesComponentsBundles' + siteName], function() {
		return 	gulp.src(path.localePluginsComponents)
		.pipe(flatten({ includeParents: -1}))
		.pipe(gulp.dest(pathBuild + '/sites/' + siteName + '/locale/'))
	});
}


function getDirectories(path) {
  return fs.readdirSync(path).filter(function (file) {
    return fs.statSync(path+'/'+file).isDirectory();
  });
}

function getSitesBundles(){
	
	var sites = getDirectories(pathBundles + '/sites')
		
	for(var i in sites){
		
		var jsonSite = JSON.parse(fs.readFileSync(pathBundles +'/sites/' + sites[i] + '/build.json'));
		
		var jsonTheme =JSON.parse(fs.readFileSync(pathBundles +'/themes/' + jsonSite.theme + '/templates/build.json'));
		
		var newSite = {'site':sites[i],'theme':jsonSite.theme,'themeParent':jsonTheme.baseTheme}
		
		sitesDefined.push(newSite);
	}	
}

function getSitesPlugins(){
	
	var sites = getDirectories(pathPlugins + '/sites');
	var defaultThemes = getDirectories(pathBundles + '/themes');
	var jsonTheme;
	
	for(var i in sites){
		
		var jsonSite = JSON.parse(fs.readFileSync(pathPlugins +'/sites/' + sites[i] + '/build.json'));
		
		if(defaultThemes.indexOf(jsonSite.theme) <0){
			
			jsonTheme =JSON.parse(fs.readFileSync(pathPlugins +'/themes/' + jsonSite.theme + '/templates/build.json'));
		
		}
		else{
			
			jsonTheme =JSON.parse(fs.readFileSync(pathBundles +'/themes/' + jsonSite.theme + '/templates/build.json'));
			
		}
		var newSite = {'site':sites[i],'theme':jsonSite.theme,'themeParent':jsonTheme.baseTheme}
		
		sitesDefined.push(newSite);
	}	
}

function getURLs(json,urls){
	array = urls;	

	if(json.childs.length <= 0){
		array.push({"url":json.url,"src":json.src});
		return array;
	}
	
	else{
		array.push({"url":json.url,"src":json.src});

		for(var i=0;i<json.childs.length;i++){
			array.concat(getURLs(json.childs[i],array));
		}
		
		return array
	}
	
}