import  fs from 'fs'
import  path from 'path'
let dircList= []
let readPromise = (folderPath) => {
  console.log(folderPath, 'folderPathfolderPath');
  return new Promise((resolve, reject) => {
    if (!folderPath) {
      return false
    }
    fs.readdirSync(folderPath).map(fileName => {
      let filePath = path.join(folderPath, fileName)
      if (!fs.lstatSync(filePath).isFile()) {
        dircList.push(fileName)
      }
    })
    resolve(dircList)
  })
}
export default readPromise

