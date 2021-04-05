const fs = require('fs');
function getSubDirNames(result){
    let directories = []
    for(let filepath of result.filePaths){    
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

module.exports.getSubDirNames = getSubDirNames;