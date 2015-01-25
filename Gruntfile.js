module.exports = function(grunt) {

	grunt.initConfig({
		uglify : {
			options: {
				mangle: false,
				preserveComments: false
			},
			production: {
				files : {
					'public/js/production.vendor.min.js' : [
						'public/js/jquery-2.1.3.min.js',
						'public/js/bootstrap.min.js',
						'public/js/handlebars-v2.0.0.js',
						'public/js/typeahead.bundle.js',
						'public/js/moment.js',
						'public/js/hammer.min.js',
						'public/js/ga.js'
					],
					'public/js/production.index.min.js' : [
						'public/js/index.js'
					],
					'public/js/production.reunion.min.js' : [
						'public/js/reunion.js'
					]

				}
			}
		},
		cssmin: {
		  target: {
		    files: {
		      'public/stylesheets/production.styles.min.css': ['public/stylesheets/style.css']
		    }
		  }
		}		
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
}