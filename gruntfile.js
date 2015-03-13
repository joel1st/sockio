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
		            'public/javascripts/*.js',
	            ],
	          	tasks: ['jshint', 'concat', 'uglify']
    		},
    		css: {
		      files: ['public/stylesheets/master.css'],
		      tasks: ['cssmin']
   		 	}
		},
	    pkg: grunt.file.readJSON('package.json'),
      	concat: {
		    dist: {
		      	src: [],
		      	dest: 'public/javascripts/master.js'
		    }
		},
		jshint: {
      		files: [
      			'*.js',
	            '*/*.js',
	            '!node_modules/*.js',
	            'public/javascripts/*.js'
	        ],
	    	options: {
	        // options here to override JSHint defaults
	        	node: true,
	        	loopfunc: true,
		        globals: {
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

    grunt.registerTask('default', []);
};