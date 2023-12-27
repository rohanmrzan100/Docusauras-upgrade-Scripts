const fs = require("fs");
const path = require("path");

// const directoryPath = "../developer-hub"; // Replace this with your directory path
const directoryPath = "../devhub"; // Replace this with your directory path

function removeCodeBlocks(directory) {
  fs.readdir(directory, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(directory, file);

      fs.stat(filePath, (error, stats) => {
        if (error) {
          console.error("Error checking file stats:", error);
          return;
        }

        if (stats.isDirectory() && file !== "node_modules") {
          removeCodeBlocks(filePath); // Recursively traverse directories, ignoring 'node_modules'
        } else if (stats.isFile() && file.endsWith(".md")) {
          fs.readFile(filePath, "utf8", (readErr, data) => {
            if (readErr) {
              console.error("Error reading file:", readErr);
              return;
            }

            const updatedContent = data.replace(
              /```mdx-code-block([\s\S]*?)```/g,
              (match, group) => {
                console.log(match);
                return group;
              }
            );

            fs.writeFile(filePath, updatedContent, "utf8", (writeErr) => {
              if (writeErr) {
                console.error("Error writing updated content:", writeErr);
                return;
              }
              console.log(`Processed file: ${filePath}`);
            });
          });
        }
      });
    });
  });
}

removeCodeBlocks(directoryPath);
