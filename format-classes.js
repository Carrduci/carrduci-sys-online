const fs = require("fs");
const path = require("path");
const glob = require("glob");
const prettier = require("prettier");

function formatClass(pattern = "**/*.html") {
    const files = glob.sync(pattern, {
        ignore: ["node_modules/**", "dist/**"],
    });

    files.forEach(async (filePath) => {
        let content = fs.readFileSync(filePath, "utf-8");

        content = await prettier.format(content, {
            filepath: filePath,
            parser: "html",
            htmlWhitespaceSensitivity: "ignore",
            singleAttributePerLine: true,
            plugins: ["prettier-plugin-tailwindcss"],
            tabWidth: 4,
        });

        content = content.replace(
            /([ \t]*)(<[^>]+class=")([^"]+)(")/g,
            (match, indent, tagStart, classes, tagEnd) => {
                const splitClasses = classes
                    .trim()
                    .split(/\s+/)
                    .filter((cls) => cls)
                    .map((cls) => cls.trim())
                    .join(`\n${indent}    `);
                return `${indent}${tagStart}\n${indent}    ${splitClasses}\n${indent}${tagEnd}`;
            },
        );

        fs.writeFileSync(filePath, content, "utf-8");
        console.log(`Formatted: ${filePath}`);
    });
}

module.exports = formatClass;

if (require.main === module) {
    formatClass(process.argv[2]);
}
