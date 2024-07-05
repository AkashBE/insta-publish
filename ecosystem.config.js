module.exports = {
    apps: [
        {
            name: 'instagram-publish',
            script: 'dist/main.js',
            instances: '1', // or a specific number of instances
            exec_mode: 'cluster', // or 'fork'
            watch: true,
            autorestart: true,
            env: {
                NODE_ENV: 'development',
            },
            env_production: {
                NODE_ENV: 'production',
            },
        },
    ],
};
