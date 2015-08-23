
'use strict';

module.exports = function (grunt) {
  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  var config = {
    app: 'frontend',
    dist: 'public',
    temp: '.tmp'
  };

  grunt.initConfig({
    config: config,

    // 监控文件变化并执行任务
    watch: {
//      bower: {
//        files: ['bower.json'],
//        tasks: ['wiredep']
//      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      //js: {
      //  files: ['<%= config.app %>/scripts/{,*/}*.js'],
      //  tasks: ['jshint'],
      //  options: {
      //    livereload: true
      //  }
      //},
      //react: {
      //  files: ['<%= config.app %>/scripts/{,*/}*.jsx'],
      //  tasks: ['react:server'],
      //  options: {
      //    livereload: true
      //  }
      //},
      //sass: {
      //  files: ['<%= config.app %>/styles/{,*/}*.{sass,scss}'],
      //  tasks: ['sass:server', 'autoprefixer']
      //},
      //styles: {
      //  files: ['<%= config.app %>/styles/{,*/}*.css'],
      //  tasks: ['newer:copy:styles', 'autoprefixer']
      //},
      js: {
        files: ['<%= config.app %>/scripts/{,*/}*.js'],
        tasks: ['jshint', 'copy:nodeserve'],
        options: {
          livereload: true
        }
      },
      react: {
        files: ['<%= config.app %>/scripts/{,*/}*.jsx'],
        tasks: ['react:dist', 'copy:nodeserve'],
        options: {
          livereload: true
        }
      },
      sass: {
        files: ['<%= config.app %>/styles/{,*/}*.{sass,scss}'],
        tasks: ['sass:dist', 'autoprefixer']
      },
      styles: {
        files: ['<%= config.app %>/styles/{,*/}*.css'],
        tasks: ['newer:copy:styles', 'autoprefixer', 'cssmin']
      },
      livereload: {
        options: {
          // livereload 端口指定
          livereload: '<%= connect.options.livereload %>'
        },
        // 监视的文件？
        files: [
          '<%= config.app %>/{,*/}*.html',
          '<%= config.temp %>/styles/{,*/}*.css',
          '<%= config.app %>/images/{,*/}*'
        ]
      }
    },

    // 本地静态服务器
    connect: {
      options: {
        // connect 启动的本地服务器地址
        hostname: 'localhost',
        // connect 启动的本地服务器端口号
        port: 9000,
        // livereload 功能所使用的端口号
        livereload: 35729
      },
      livereload: {
        options: {
          middleware: function (connect, options) {
            // 监控这两个目录
            return [
              connect.static(config.temp),
              connect().use('/bower_components', connect.static('./bower_components')),
              connect.static(config.app)
            ];
          }
        }
      },
      dist: {
        optons: {
          base: '<%= config.dist %>',
          livereload: false
        }
      }
    },
    // bower 路径依赖自动补全
//    wiredep: {
//      app: {
//        ignorePath: /^\/|\.\.\//,
//        src: ['<%= config.app %>/{,*/}*.html']
//      },
//      sass: {
//        ignorePath: /(\.\.\/){1,2}bower_components\//,
//        src: ['<%= config.app %>/styles/{,*/}*.{sass,scss}']
//      }
//    },
    // server 情况下运行 server 任务，该任务只复制字体和 js 文件到 config.temp 目录
    // 发布情况下全部执行，先将 css 文件复制到 config.temp 文件夹中
    // 再复制字体和 js 文件到 config.temp 文件夹
    // 最后将所有网页文件和字体文件从 config.temp 文件夹复制到 config.dist 文件夹
    // Ps: css 文件和 js 文件通过 cssmin 和 uglify 压缩后放入 config.dist 文件夹中，此处无需插手
    copy: {
      styles: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= config.app %>/styles',
          dest: '<%= config.temp %>/styles',
          src: '{,*/}*.css'
        }]
      },
      server: {
        files: [{
          expand: true,
          dot: true,
          cwd: 'bower_components/bootstrap-sass/assets/fonts',
          dest: '<%= config.temp %>/fonts',
          src: '{,*/}*'
        }, {
          dest: '<%= config.temp %>/scripts/lib/jquery.js',
          src: 'bower_components/jquery/dist/jquery.js'
        }, {
          dest: '<%= config.temp %>/scripts/lib/react.js',
          src: 'bower_components/react/react.js'
        }, {
          dest: '<%= config.temp %>/scripts/lib/require.js',
          src: 'bower_components/requirejs/require.js'
        }, {
          dest: '<%= config.temp %>/scripts/lib/ReactRouter.js',
          src: 'bower_components/react-router/build/umd/ReactRouter.js'
        }, {
          dest: '<%= config.temp %>/scripts/lib/react-bootstrap.js',
          src: 'bower_components/react-bootstrap/react-bootstrap.js'
        }, {
          dest: '<%= config.temp %>/scripts/lib/bootstrap.js',
          src: 'bower_components/bootstrap-sass/assets/javascripts/bootstrap.js'
        }/*, {
          cwd: '',
          dest: '<%= config.temp %>/scripts/angular.js',
          src: 'bower_components/angular/angular.js'
        }, {
          cwd: '',
          dest: '<%= config.temp %>/scripts/require.js',
          src: 'bower_components/requirejs/require.js'
        }*/]
      },
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= config.app %>',
          dest: '<%= config.dist %>',
          src: [
            '{,*/}*.{ico,png,txt}',
            '{,*/}*html'
          ]
        }, {
          expand: true,
          dot: true,
          cwd: '<%= config.app %>/scripts',
          dest: '<%= config.temp %>/scripts',
          src: ['{,*/}*.js']
        }, {
          dest: '<%= config.temp %>/scripts/lib/jquery.js',
          src: 'bower_components/jquery/dist/jquery.js'
        }, {
          dest: '<%= config.temp %>/scripts/lib/react.js',
          src: 'bower_components/react/react.js'
        }, {
          dest: '<%= config.dist %>/scripts/lib/require.js',
          src: 'bower_components/requirejs/require.js'
        }, {
          dest: '<%= config.temp %>/scripts/lib/ReactRouter.js',
          src: 'bower_components/react-router/build/umd/ReactRouter.js'
        }, {
          dest: '<%= config.temp %>/scripts/lib/react-bootstrap.js',
          src: 'bower_components/react-bootstrap/react-bootstrap.js'
        }, {
          dest: '<%= config.temp %>/scripts/lib/bootstrap.js',
          src: 'bower_components/bootstrap-sass/assets/javascripts/bootstrap.js'
        }]
      },
      nodeserve: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= config.app %>',
          dest: '<%= config.dist %>',
          src: [
            '{,*/}*.{ico,png,txt}',
            '{,*/}*html'
          ]
        }, {
          expand: true,
          dot: true,
          cwd: '<%= config.app %>/scripts',
          dest: '<%= config.dist %>/scripts',
          src: ['{,*/}*.js']
        }, {
          expand: true,
          dot: true,
          cwd: '<%= config.temp %>/scripts',
          dest: '<%= config.dist %>/scripts',
          src: ['{,*/}*.js']
        }, {
          dest: '<%= config.dist %>/scripts/lib/jquery.js',
          src: 'bower_components/jquery/dist/jquery.js'
        }, {
          dest: '<%= config.dist %>/scripts/lib/react.js',
          src: 'bower_components/react/react.js'
        }, {
          dest: '<%= config.dist %>/scripts/lib/require.js',
          src: 'bower_components/requirejs/require.js'
        }, {
          dest: '<%= config.dist %>/scripts/lib/ReactRouter.js',
          src: 'bower_components/react-router/build/umd/ReactRouter.js'
        }, {
          dest: '<%= config.dist %>/scripts/lib/react-bootstrap.js',
          src: 'bower_components/react-bootstrap/react-bootstrap.js'
        }, {
          dest: '<%= config.dist %>/scripts/lib/bootstrap.js',
          src: 'bower_components/bootstrap-sass/assets/javascripts/bootstrap.js'
        }]
      }
    },
    // 清理工程目录
    clean: {
      server: '<%= config.temp %>',
      dist: {
        files: [{
          dot: true,
          src: [
            '<%= config.temp %>',
            '<%= config.dist %>/{,*/}*.html',
            '!<%= config.dist %>/.git*'
          ]
        }, {
          dot: true,
          src: ['<%= config.dist %>/scripts']
        }]
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      }
    },
    sass: {
      options: {
        sourceMap: true,
        includesPaths: ['bower_components']
      },
      server: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/styles',
          src: ['{,*/}*.{sass,scss}'],
          dest: '<%= config.temp %>/styles',
          ext: '.css'
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/styles',
          src: ['{,*/}*.{sass,scss}'],
          dest: '<%= config.temp %>/styles',
          ext: '.css'
        }]
      }
    },
    cssmin: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= config.temp %>/styles',
          dest: '<%= config.dist %>/styles',
          src: ['{,*/}*.css']
        }]
      }
    },
    uglify: {
      dist: {
        files: [
//        {
//          expand: true,
//          dot: true,
//          cwd: '<%= config.temp %>/scripts',
//          dest: '<%= config.dist %>/scripts',
//          src: ['{,*/}*.js']
//        }, 
        {
          expand: true,
          dot: true,
          cwd: '<%= config.app %>/scripts',
          dest: '<%= config.dist %>/scripts',
          src: ['{,*/}*.js']
        }]
      }
    },
    // css 文件浏览器前缀补充
    autoprefixer: {
      options: {
        browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.temp %>/styles/',
          src: '{,*/}*.css',
          dest: '<%= config.temp %>/styles/'
        }]
      }
    },
    react: {
      server: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/scripts',
          src: ['{,*/}*.jsx'],
          dest: '<%= config.temp %>/scripts',
          ext: '.js'
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/scripts',
          src: ['{,*/}*.jsx'],
          dest: '<%= config.temp %>/scripts',
          ext: '.js'
        }]
      }
    },
    requirejs: {
      dist: {
        options: {
          name: 'root/app',
          optimize: 'uglify',
          baseUrl: '<%= config.temp %>/scripts/lib',
          mainConfigFile: '<%= config.temp %>/scripts/app.js',
          out: '<%= config.dist %>/scripts/app.js'
        }
      }
    },
    htmlmin: {
      build: {
        options: {
          removeComments: true,
          removeCommentsFromCDATA: true,
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeRedundantAttributes: true,
          useShortDoctype: true
        },
        files: [{
            expand: true,
            cwd: '<%= config.app %>',
            src: ['{,*/}*.html'],
            dest: '<%= config.dist %>'
          }]
      }
    },
    // 多线程任务
    concurrent: {
      server: [
        'sass:server',
        'copy:server',
        'react:server'
      ],
      dist: [
        'sass:dist',
        'copy:styles',
        'copy:dist'
      ],
      nodeserve: [
        'sass:dist',
        'copy:styles'
      ]
    }
  });

  grunt.registerTask('serve', 'start the server and preview your app, --allow-remote for remote access', function (target) {
    if (grunt.option('allow-remote')) {
      grunt.config.set('connect.options.hostname', '0.0.0.0');
    }
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('nodeserve', [
    'clean:dist',
    'concurrent:nodeserve',
    'autoprefixer',
    'react:dist',
    'copy:nodeserve',
    'watch'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'concurrent:dist',
    'autoprefixer',
    'cssmin',
    //'uglify'
    'react:dist',
    'requirejs:dist',
    'htmlmin'
  ]);
};

// sign 需要为 bower_components 文件夹加更新监听（虽然一般不能改里面的东西）
// sign 图片压缩不知道需要不需要