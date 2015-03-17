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
	            ],
	          	tasks: ['jshint']
    		},
    		css: {
		      files: ['public/stylesheets/master.css'],
		      tasks: ['cssmin']
   		 	}
		},
	    pkg: grunt.file.readJSON('package.json'),
      	concat: {
		    dist: {
		      	src: ['public/dist/js/angular.min.js', 'public/dist/js/angular-route.js', 
		      		'public/dist/js/moment.js', 'public/dist/js/angular-moment.min.js', 'public/js/app.js',
		      		'public/js/controllers.js','public/js/services.js', 'public/js/directives.js'],
		      	dest: 'public/js/master.js'
		    }
		},
		jshint: {
      		files: [
      			'*.js',
	            '*/*.js',
	            '!node_modules/*.js',
	            'public/js/*.js'
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
			      	
			    }
			}
		},
		cssmin: {
		    build: {
		        src: 'public/stylesheets/master.css',
		        dest: 'public/stylesheets/master.css'
		    }
    	}
    });
	grunt.registerTask('production', ['concat']);

    grunt.registerTask('default', []);
};