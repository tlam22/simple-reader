const fs = require('fs');
const isImage = require('is-image');
function getSubDirNames(directory){
    let directories = []
    for(let filepath of directory){    
        const testFolder =  filepath;
        fs.readdirSync(testFolder).forEach(file => {
         let fullPath = `${testFolder}\\${file}`;
         if(fs.lstatSync(fullPath).isDirectory()){
            directories.push(fullPath);
         }
        });
      }
    return directories;
}

function getImageFiles(directory){
  let files = []
  for(let filepath of directory){    
      const testFolder =  filepath;
      const title = filepath.split("\\").splice(-1)[0];
      let f = fs.readdirSync(testFolder);
      for(let file of f){
        let fullPath = `${testFolder}\\${file}`;
        if(isImage(fullPath)){
           files.push({title: title, imagePath: fullPath});
        }
      }
    }
  return files;

}

module.exports.getSubDirNames = getSubDirNames;
module.exports.getImageFiles = getImageFiles;