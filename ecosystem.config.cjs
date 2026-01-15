module.exports = {
    apps: [
      {
        name: 'transit-portal',
        exec_mode: 'fork', // Next.js typically runs in a single instance, fork mode is sufficient.
        instances: 1, // Run a single instance (can be increased based on load)
        script: 'node_modules/.bin/next', // This is the Next.js start script
        args: 'start', // Runs Next.js in production mode
        env: {
          NODE_ENV: 'production',
          PORT: 3004, // Define the port for production
        },
        env_development: {
          NODE_ENV: 'development',
          PORT: 3001, // Define the port for development
        },
        watch: false, // Typically, we don't watch in production mode
        autorestart: true,
        max_restarts: 10,
        restart_delay: 5000, // Wait for 5 seconds before restarting
      },
    ],
  };
  