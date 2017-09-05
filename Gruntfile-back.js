module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: ['app.js']
    },
    notify: {
      task_name: {
        options: {
          // Task-specific options go here.
        }
      },
      watch: {
        options: {
          title: '"Task Complete"',  // optional
          message: '"SASS and Uglify finished running"', //required
        }
      },
      server: {
        options: {
          message: '"Server is ready!"'
        }
      }
    },
    watch: {
      server: {
        files: ['app.js','server/*.js','server/**/*.js'],
        tasks: ['jshint'],
        options: {
          livereload: true,
          spawn: false,
        },
      },
      client: {
        files: ['public/*.js','public/**/*.js'],
        tasks: ['concat:client'],
        options: {
          livereload: true,
          spawn: false,
        },
      },
      css: {
        files: ['**/*.css'],
        options: {
          livereload: true,
        }
      },
    },
    nodemon: {
      start: {
        script: './bin/www',
        tasks: ["concat:client","watch:client"]
      },
      server: {
        script: './bin/www',
        tasks: ['watch:server']
      }
    },
    concat: {
      options: {
        separator: ';',
        stripBanners: true,
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today() %> */\n',
      },
      client: {
        src: [

          "public/main_app.js",
          "public/constants.js",
          "public/modules/*.js",
          "public/modules/**/.js",
          "public/main_app.js",
          "public/directive/*.js",
          "public/directive/**/*.js",
          "public/controller/*.js",
          "public/models/*.js",
          "public/controller/**/*.js",
          "public/services/*.js",
          "public/services/**/*.js",
        ],
        tasks:['notify:server'],
        dest: 'public/dist/built.js',
      },
    },

  });

  // loading tasks modules
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-contrib-concat');
  // grunt.loadNpmTasks("grunt-concurrent")
  //grunt.loadNpmTasks('grunt-notify');
  //grunt.task.run('notify_hooks');
  // registerTask
 //grunt.registerTask("watch", ["concat:client","nodemon:server"]);
  // grunt.registerTask("start", ["nodemon:start"]);
  // grunt.registerTask("client", ["concat:client","watch:client"]);
  grunt.registerTask("con", ['concat','watch:client']);
  //grunt.registerTask("notify", ['notify:server'] );
};
