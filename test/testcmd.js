const assert = require('assert')
const fs = require('fs')
const path = require('path')
const html2pug = require('../src/html2pug')

function testFile (inputFile, expectedFile, fileDone) {
  const input = fs.readFileSync(inputFile, 'utf8')
  html2pug(input).then(actual => {
    const expected = fs.readFileSync(expectedFile, 'utf8')
    assert.strict.equal(actual, expected)
    fileDone()
  }).catch(err => fileDone(err))
}

describe('html2jade', function () {
  const testDir = function (inputDir, expectedDir) {
    inputDir = path.resolve(__dirname, inputDir)
    expectedDir = path.resolve(__dirname, expectedDir)

    const inputFiles = fs.readdirSync(inputDir)

    inputFiles.forEach(function (inputFile) {
      let extname = path.extname(inputFile)
      const basename = path.basename(inputFile, extname)
      extname = extname.toLowerCase()
      if (extname === '.html' || extname === '.htm') {
        inputFile = path.join(inputDir, inputFile)
        const expectedFile = path.join(expectedDir, `${basename}.jade`)
        // console.log "processing #{inputFile}"
        it(`should convert ${path.basename(
          inputFile
        )} to output matching ${path.basename(expectedFile)}`, (done) =>
          testFile(inputFile, expectedFile, done))
      }
    })
  }

  return testDir('./data/', './data/')
})
