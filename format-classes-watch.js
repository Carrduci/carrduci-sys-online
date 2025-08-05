const chokidar = require("chokidar");
const formatClasses = require("./format-classes");

chokidar
    .watch(".", {
        ignored: ["node_modules/**", "dist/**"],
        persistent: true,
        usePolling: true,
        interval: 1000,
    })
    .on("all", (event, path) => {
        console.log(event);
        if (!!path.match(/[^"]+.html/)) {
            formatClasses(path);
        }
    });
