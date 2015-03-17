"use strict";
module.exports = function(grunt){

	require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({
      	watch: {
		    js: {
	          	files: [
	          		'*.js',
		            '*/*.js',
		            '!node_modules/*.js',
		            'public/js/*.js',
		            '!public/js/master.min.js'
	            ],
	          	tasks: ['jshint']
    		}
		},
	    pkg: grunt.file.readJSON('package.json'),
      	concat: {
		    js: {
		      	src: ['public/dist/js/angular.min.js', 'public/dist/js/angular-route.js', 
		      		'public/dist/js/moment.js', 'public/dist/js/angular-moment.min.js', 'public/js/app.js',
		      		'public/js/controllers.js','public/js/services.js', 'public/js/directives.js'],
		      	dest: 'public/js/master.min.js'
		    },
		    css: {
		      	src: ['public/dist/css/bootstrap.min.css', 'public/css/style.css'],
		      	dest: "public/css/style.min.css"
		    }
		},
		jshint: {
      		files: [
      			'*.js',
	            '*/*.js',
	            '!node_modules/*.js',
	            'public/js/*.js',
	            '!public/js/master.min.js'
	        ],
	    	options: {
	        // options here to override JSHint defaults
	        	node: true,
	        	loopfunc: true,
		        globals: {
		        	angular: true,
		        	chatApp: true,
		        	chatIoData: true,
		        	document:true,
		        	io:true,
		        	jQuery: false,
		        	console: true,
		        	module: true,
					require: true
		        }
		    }
      	},
	    uglify: {
			build:  {
			    files: {
			      	'public/js/master.min.js': 'public/js/master.min.js'
			    }
			}
		},
		cssmin: {
		    build: {
		        src: 'public/css/style.min.css',
		        dest: 'public/css/style.min.css'
		    }
    	}
    });
	grunt.registerTask('production', ['concat', 'uglify','cssmin']);

    grunt.registerTask('default', []);
};