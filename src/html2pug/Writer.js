const Ent = require('he')
const { __guard__, isValidJadeId, isValidJadeClassName } = require('./helpers')

class Writer {
  constructor ({ noattrcomma, wrapLength = 80, double, noemptypipe, entOptions, inlineCSS }) {
    this.wrapLength = wrapLength
    this.attrSep = noattrcomma ? ' ' : ', '
    if (double) {
      this.attrQuote = '"'
      this.nonAttrQuote = "'"
    } else {
      this.attrQuote = "'"
      this.nonAttrQuote = '"'
    }
    this.attrQuoteEscaped = `\\${this.attrQuote}`
    this.noEmptyPipe = noemptypipe
    this.entOptions = entOptions
    this.inlineCSS = inlineCSS
  }
  tagHead (node) {
    let result = node.tagName !== 'DIV' ? node.tagName.toLowerCase() : ''
    if (node.id && isValidJadeId(node.id)) {
      result += `#${node.id}`
    }
    if (!this.inlineCSS && node.hasAttribute('class') && (node.getAttribute('class').length > 0)) {
      const validClassNames = node.getAttribute('class').split(/\s+/).filter(item => item && isValidJadeClassName(item))
      result += `.${validClassNames.join('.')}`
    }
    if (result.length === 0) { result = 'div' }
    return result
  }

  tagAttr (node, indents) {
    if (indents == null) { indents = '' }
    const attrs = node.attributes
    if (!attrs || (attrs.length === 0)) {
      return ''
    } else {
      const result = []
      for (let attr of Array.from(attrs)) {
        if (attr && attr.nodeName) {
          const attrName = attr.nodeName
          let attrValue = attr.nodeValue
          if ((attrName === 'id') && isValidJadeId(attrValue)) {
            // should already be emitted as #id, ignore
          } else if (attrName === 'class' && !this.inlineCSS) {
            const invalidClassNames = node.getAttribute('class').split(/\s+/).filter(item => item && !isValidJadeClassName(item))
            if (invalidClassNames.length > 0) {
              result.push(this.buildTagAttr(attrName, invalidClassNames.join(' ')))
            }
          } else if (attrName === 'class' && this.inlineCSS) {
            result.push(this.buildTagAttr(attrName, node.getAttribute('class')))
          } else {
            attrValue = attrValue.replace(/(\r|\n)\s*/g, `\\$1${indents}`)
            result.push(this.buildTagAttr(attrName, attrValue))
          }
        }
      }
      if (result.length > 0) {
        return `(${result.join(this.attrSep)})`
      } else {
        return ''
      }
    }
  }

  buildTagAttr (attrName, attrValue) {
    if (!attrValue.includes(this.attrQuote)) {
      return `${attrName}=${this.attrQuote}${attrValue}${this.attrQuote}`
    } else if (!attrValue.includes(this.nonAttrQuote)) {
      return `${attrName}=${this.nonAttrQuote}${attrValue}${this.nonAttrQuote}`
    } else {
      attrValue = attrValue.replace(new RegExp(this.attrQuote, 'g'), this.attrQuoteEscaped)
      return `${attrName}=${this.attrQuote}${attrValue}${this.attrQuote}`
    }
  }

  tagText ({ firstChild, lastChild }) {
    if ((firstChild != null ? firstChild.nodeType : undefined) !== 3) {
      return null
    } else if (firstChild !== lastChild) {
      return null
    } else {
      const {
        data
      } = firstChild
      if ((data.length > this.wrapLength) || data.match(/\r|\n/)) {
        return null
      } else {
        return data
      }
    }
  }

  forEachChild (parent, cb) {
    if (parent) {
      let child = parent.firstChild
      return (() => {
        const result = []
        while (child) {
          cb(child)
          result.push(child = child.nextSibling)
        }
        return result
      })()
    }
  }

  writeTextContent (node, output, options) {
    output.enter()
    this.forEachChild(node, child => this.writeText(child, output, options))
    return output.leave()
  }

  writeText (node, output, options) {
    if (node.nodeType === 3) {
      const data = node.data || ''
      if (data.length > 0) {
        const lines = data.split(/\r|\n/)
        return lines.forEach(line => this.writeTextLine(node, line, output, options))
      }
    }
  }

  writeTextLine (node, line, output, options) {
    if (options == null) { options = {} }
    const pipe = options.pipe != null ? options.pipe : true
    const wrap = options.wrap != null ? options.wrap : true
    const encodeEntityRef = options.encodeEntityRef != null ? options.encodeEntityRef : false
    const escapeBackslash = options.escapeBackslash != null ? options.escapeBackslash : false
    if (pipe && this.noEmptyPipe && (line.trim().length === 0)) { return }
    const prefix = pipe ? '| ' : ''
    if (__guard__(node != null ? node.previousSibling : undefined, ({ nodeType }) => nodeType) !== 1) { line = line.trimLeft() }
    if (__guard__(node != null ? node.nextSibling : undefined, ({ nodeType }) => nodeType) !== 1) { line = line.trimRight() }
    if (line) { // ignore empty lines
      // escape backslash
      if (encodeEntityRef) { line = Ent.encode(line, this.entOptions) }
      if (escapeBackslash) { line = line.replace('\\', '\\\\') }
      if (!wrap || (line.length <= this.wrapLength)) {
        return output.writeln(prefix + line)
      } else {
        const lines = this.breakLine(line)
        if (lines.length === 1) {
          return output.writeln(prefix + line)
        } else {
          return lines.forEach(line => this.writeTextLine(node, line, output, options))
        }
      }
    }
  }

  breakLine (line) {
    if (!line || (line.length === 0)) { return [] }
    return [line]
    // const lines = []
    // const words = line.split(/\s+/)
    // line = ''
    // while (words.length) {
    //   const word = words.shift()
    //   if ((line.length + word.length) > this.wrapLength) {
    //     lines.push(line)
    //     line = word
    //   } else if (line.length) {
    //     line += ` ${word}`
    //   } else {
    //     line = word
    //   }
    // }
    // if (line.length) {
    //   lines.push(line)
    // }
    // return lines
  }
}

module.exports = Writer
