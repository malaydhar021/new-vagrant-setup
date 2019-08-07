module.exports = {
  apps: [
    {
      name: "sr-ws",
      script: "./server.js",
      instances: 0,
      exec_mode: "cluster",
      watch: true,
      env: {
        NODE_ENV: "production",
        PORT: "3000"
      }
    }
  ]
};
