module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        /*
         * WATCH
         */
        watch: {
            css: {
                files: ['assets/sass/*/*.scss'],
                tasks: ['sass', 'autoprefixer', 'css_mqpacker', 'stripmq', 'cssmin', 'ftpush:build']
            },
            scripts: {
                files: ['assets/js/*/*.js','assets/js/*.js'],
                tasks: ['concat', /*'uglify', */ 'ftpush:build' ]
            }
        },


        /*
         * CSS
         */
        sass: {
            dist: {
                options: {
                    style: 'expanded',
                    sourcemap: true
                },
                files: {
                    'assets/css/style.css': 'assets/sass/style.scss',
                    'assets/css/style-ie.css': 'assets/sass/style-ie.scss'
                }
            }
        },
        autoprefixer: {
            options: {
                browsers: ['last 2 version']
            },
            multiple_files: {
                expand: true,
                flatten: true,
                src: 'assets/css/style.css',
                dest: 'assets/css/'
            }
        },
        css_mqpacker: {
            options: {
                map: false
            },
            main: {
                expand: true,
                cwd: 'assets/css/',
                src: 'style.css',
                dest: 'assets/css/'
            }
        },
        stripmq: {
            options: {
                width: '65em',
                type: 'screen'
            },
            all: {
                files: {
                    'assets/css/style-ie.css': ['assets/css/style-ie.css']
                }
            }
        },
        pixrem: {
            options: {
              rootvalue: '62.5%',
              replace: true
            },
            dist: {
              src: 'assets/css/style-ie.css',
              dest: 'assets/css/style-ie.css'
            }
        },
        cssmin: {
            main: {
                expand: true,
                cwd: 'assets/css/',
                src: '*.css',
                dest: 'assets/build/css/',
                ext: '.min.css'
            }
        },


        /*
         * JS
         */
        concat: {
            dist: {
                src: ['assets/js/plugin/*.js','assets/js/*.js'],
                dest: 'assets/build/js/script.min.js'
            }
        },
        uglify: {
            build: {
                src: 'assets/build/js/script.min.js',
                dest: 'assets/build/js/script.min.js'
            }
        },

        
        /*
         * MISC
         */
        'ftpush': {
            build: {
                auth: {
                    host: '217.147.85.119',
                    port: 21,
                    authKey: 'key2'
                },
                src: 'assets/build',
                dest: 'umbraco.tgdh.co.uk/assets/',
                exclusions: ['img/*', '**/.DS_Store', '**/Thumbs.db'],
                keep: ['/img/*']
              }
        }

        // 'ftp-deploy': {
        //     watch: {
        //         auth: {
        //             host: '10.0.40.19',
        //             port: 47,
        //             authKey: 'key1'
        //         },
        //         src: 'assets/build',
        //         dest: '/assets/',
        //         exclusions: ['assets/build/img']
        //     },
        //     build: {
        //         auth: {
        //             host: '10.0.40.19',
        //             port: 47,
        //             authKey: 'key1'
        //         },
        //         src: 'assets/build',
        //         dest: '/assets/',
        //         exclusions: []
        //     }
        // }
    });


    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-css-mqpacker');
    grunt.loadNpmTasks('grunt-stripmq');
    grunt.loadNpmTasks('grunt-pixrem');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');


    grunt.loadNpmTasks('grunt-ftpush');

    grunt.loadNpmTasks('grunt-contrib-watch');


    grunt.registerTask('dev', [
        'css',
        'js',
        'watch'
    ]);

    grunt.registerTask('build', [
        'css',
        'js'
    ]);


    grunt.registerTask('css', [
        'sass', 
        'autoprefixer', 
        'css_mqpacker', 
        'stripmq', 
        'pixrem', 
        'cssmin'
    ]);

    grunt.registerTask('js', [
        'concat',
        'uglify'
    ]);

    grunt.registerTask('images', [
        'responsive_images',
        'svg2png',
        'svgmin',
        'imageoptim'
    ]);

    grunt.registerTask('deploy', 'ftpush:build');
};