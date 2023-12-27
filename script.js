const fs = require("fs");
const path = require("path");

// const folderPath = "../developer-hub"; // Replace this with your folder path
// const folderPath = "../my-website"; // Replace this with your folder path
const folderPath = "./"; // Replace this with your folder path

const regex = /```[^`]*```|`[^`]*`|<\+|(\<\+)|(?!`[^`]*`)<\+/g;

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
          // Check if the directory is 'node_modules', then skip it
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

            const updatedContent = data.replace(regex, (match, p1) => {
              if (match === "<+") {
                const isInBackticks =
                  p1 && p1.startsWith("`") && p1.endsWith("`");
                return isInBackticks ? match : `\\${match}`;
              }
              return match;
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
