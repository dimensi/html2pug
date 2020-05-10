const { __range__ } = require('./helpers')

class Output {
  constructor ({ useTabs, nspaces }) {
    this.indents = ''
    this.useTabs = useTabs
    this.nspaces = nspaces
  }
  enter () {
    if (this.useTabs) {
      return (this.indents += '\t')
    } else {
      return __range__(1, this.nspaces, true).map((i) => (this.indents += ' '))
    }
  }
  leave () {
    if (this.useTabs) {
      return (this.indents = this.indents.substring(1))
    } else {
      return (this.indents = this.indents.substring(this.nspaces))
    }
  }
  write (data, indent) {
    if (indent == null) { indent = true }
  }
  writeln (data, indent) {
    if (indent == null) { indent = true }
  }
}

module.exports = Output
