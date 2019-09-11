var GulpConfig = (function () {
    function gulpConfig() {
        this.builderTsConfig = 'tsconfig.json';
        this.builderTsFiles = [
            'src/**/*.ts',
            'src/*.ts'
        ];
        this.builderJsFiles = [
            'src/**/*.js',
            'src/**/*.js.map',
            'src/*.js',
            'src/*.js.map'
        ];
    }
    return gulpConfig;
})();

module.exports = GulpConfig;