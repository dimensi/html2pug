const Output = require('./Output')

class StringOutput extends Output {
  constructor (options) {
    super(options)
    this.fragments = []
  }
  write (data, indent) {
    if (indent == null) { indent = true }
    if (data == null) { data = '' }
    if (indent) {
      return this.fragments.push(this.indents + data)
    } else {
      return this.fragments.push(data)
    }
  }
  writeln (data, indent) {
    if (indent == null) { indent = true }
    if (data == null) { data = '' }
    if (indent) {
      return this.fragments.push(this.indents + data + '\n')
    } else {
      return this.fragments.push(data + '\n')
    }
  }
  final () {
    const result = this.fragments.join('')
    this.fragments = []
    return result
  }
}

module.exports = StringOutput
