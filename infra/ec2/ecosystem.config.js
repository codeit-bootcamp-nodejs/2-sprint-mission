module.exports = {
    apps: [{
        cwd: '../../',
        script: 'build/server.js',
        watch: './build',
        env: {
            NODE_ENV: "production",
        }
    }],
};
