const fs = require("fs");
const path = require("path");

const folderPath = "../devhub";

const summaryTagRegex = /(\s*)<summary>/g;

function processFilesInFolder(folder) {
  fs.readdir(folder, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(folder, file);

      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(`Error stating file ${file}:`, err);
          return;
        }

        if (stats.isDirectory()) {
          if (file === "node_modules") {
            console.log(`Skipping node_modules folder: ${filePath}`);
            return;
          }
          processFilesInFolder(filePath); // Recursive call for subdirectories
        } else if (path.extname(file) === ".md") {
          fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
              console.error(`Error reading file ${file}:`, err);
              return;
            }

            const updatedContent = data
              .replace(summaryTagRegex, (match, spaces) => {
                // Remove all spaces preceding <summary> tag on the same line
                return "\n<summary>";
              });

            fs.writeFile(filePath, updatedContent, "utf8", (err) => {
              if (err) {
                console.error(`Error writing to file ${file}:`, err);
              } else {
                console.log(`Updated file: ${file}`);
              }
            });
          });
        }
      });
    });
  });
}

processFilesInFolder(folderPath);
