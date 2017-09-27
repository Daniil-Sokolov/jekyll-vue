module.exports = function(grunt) {

    // Define scope for `load-grunt-tasks` package.
    var tasks = { scope: ['devDependencies', 'dependencies'] };

    // Define location of config files for `load-grunt-configs`.
    var options = { config: { src: "grunt-config/*.js" } };

    // Require `load-grunt-configs` with the defined options.
    var configs = require('load-grunt-configs')(grunt, options);

    // Load the various task configuration files.
    grunt.initConfig(configs);

    // Auto-load tasks.
    require('load-grunt-tasks')(grunt, tasks);

    // Register tasks
    // -------------------------------------------------------------------------
    grunt.registerTask('default', [
        'sass:development',
        'concat:public',
        'uglify:public',
        'exec:dev',
        //'copy:fonts',
        'watch'
    ]);

    grunt.registerTask('deploy', [
        'exec:build',
        'exec:deploy'
    ]);

};
