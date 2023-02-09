module.exports = {
    apps: [
      {
        script: "dist/main.js",
        watch: true,
        name: "mainFork1",
        autorestart: true,
        args: "-p 8082"
      },
      {
        script: "dist/main.js",
        watch: true,
        name: "mainFork2",
        autorestart: true,
        args: "-p 8083"
      },
      {
        script: "dist/main.js",
        watch: true,
        name: "mainFork3",
        autorestart: true,
        args: "-p 8084"
      },
      {
        script: "dist/main.js",
        watch: true,
        name: "mainFork4",
        autorestart: true,
        args: "-p 8085"
      }
    ]
  }