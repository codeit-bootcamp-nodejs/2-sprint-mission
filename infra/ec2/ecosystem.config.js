module.exports = {
    apps: [{
        script: '../../build/server.js',
        watch: '.',
        env: {
            NODE_ENV: "production",
        }
    }],
};
