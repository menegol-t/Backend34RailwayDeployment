module.exports = {
  apps: [
    {
      script: "dist/main.js",
      watch: true,
      name: "mainJSClusterConfig",
      autorestart: true,
      instances: "max"
    }
  ]
}
