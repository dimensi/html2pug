const Ent = require('he')
const Writer = require('./Writer')

const publicIdDocTypeNames = {
  '-//W3C//DTD XHTML 1.0 Transitional//EN': 'transitional',
  '-//W3C//DTD XHTML 1.0 Strict//EN': 'strict',
  '-//W3C//DTD XHTML 1.0 Frameset//EN': 'frameset',
  '-//W3C//DTD XHTML 1.1//EN': '1.1',
  '-//W3C//DTD XHTML Basic 1.1//EN': 'basic',
  '-//WAPFORUM//DTD XHTML Mobile 1.2//EN': 'mobile'
}

const systemIdDocTypeNames = {
  'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd': 'transitional',
  'http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd': 'strict',
  'http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd': 'frameset',
  'http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd': '1.1',
  'http://www.w3.org/TR/xhtml-basic/xhtml-basic11.dtd': 'basic',
  'http://www.openmobilealliance.org/tech/DTD/xhtml-mobile12.dtd': 'mobile'
}

class Converter {
  constructor (options) {
    const { entOptions, doNotEncode, bodyless } = options
    this.bodyless = bodyless
    this.entOptions = entOptions
    this.doNotEncode = doNotEncode
    this.writer = new Writer(options)
  }

  document (document, output) {
    if (document.doctype != null) {
      const {
        doctype: { publicId, systemId, name }
      } = document
      let docTypeName
      if ((publicId != null) && (publicIdDocTypeNames[publicId] != null)) {
        docTypeName = publicIdDocTypeNames[publicId]
      } else if ((systemId != null) && (systemIdDocTypeNames[systemId] != null)) {
        docTypeName = (systemIdDocTypeNames[systemId] != null)
      } else if ((name != null) && (name.toLowerCase() === 'html')) {
        docTypeName = 'html'
      }
      if (docTypeName != null) {
        output.writeln('doctype ' + docTypeName)
      }
    }

    if (document.documentElement) {
      return this.children(document, output, false)
    } else {
      // documentElement is missing.
      // not sure why but this happens with jsdom when document has no body
      // HACK: generate manually
      const htmlEls = document.getElementsByTagName('html')
      if (htmlEls.length > 0) { return this.element(htmlEls[0], output) }
    }
  }

  element (node, output) {
    if (!(node != null ? node.tagName : undefined)) { return }
    // console.log "tag: #{node.tagName}"
    const tagName = node.tagName.toLowerCase()
    const tagHead = this.writer.tagHead(node)
    const tagAttr = this.writer.tagAttr(node, output.indents)
    const tagText = this.writer.tagText(node)
    if ((tagName === 'script') || (tagName === 'style')) {
      if (node.hasAttribute('src')) {
        output.writeln(tagHead + tagAttr)
        return this.writer.writeTextContent(node, output, {
          pipe: false,
          wrap: false
        }
        )
      } else if (tagName === 'script') {
        return this.script(node, output, tagHead, tagAttr)
      } else if (tagName === 'style') {
        return this.style(node, output, tagHead, tagAttr)
      }
    } else if (tagName === 'conditional') {
      output.writeln('//' + node.getAttribute('condition'))
      return this.children(node, output)
    } else if (['pre'].indexOf(tagName) !== -1) {
      // HACK: workaround jade's wonky PRE handling
      output.writeln(tagHead + tagAttr + '.')
      output.enter()
      let firstline = true
      this.writer.forEachChild(node, child => {
        if (child.nodeType === 3) {
          let {
            data
          } = child
          if ((data != null) && (data.length > 0)) {
            if (firstline) {
              // suckup starting linefeed if any
              if (data.search(/\r\n|\r|\n/) === 0) {
                data = data.replace(/\r\n|\r|\n/, '')
              }
              data = '\\n' + data
              firstline = false
            }
            data = data.replace(/\t/g, '\\t')
            data = data.replace(/\r\n|\r|\n/g, '\n' + output.indents)
            return output.write(data)
          }
        }
      })
      output.writeln()
      return output.leave()
    } else if (this.bodyless && ((tagName === 'html') || (tagName === 'body'))) {
      return this.children(node, output, false)
    } else if (tagText) {
      if (this.doNotEncode) {
        // do not encode tagText - for template variables like {{username}} inside of tags
        return output.writeln(tagHead + tagAttr + ' ' + tagText)
      } else {
        return output.writeln(tagHead + tagAttr + ' ' + Ent.encode(tagText, this.entOptions))
      }
    } else {
      output.writeln(tagHead + tagAttr)
      return this.children(node, output)
    }
  }

  children (parent, output, indent) {
    if (indent == null) { indent = true }
    if (indent) { output.enter() }
    this.writer.forEachChild(parent, child => {
      const {
        nodeType
      } = child
      if (nodeType === 1) { // element
        return this.element(child, output)
      } else if (nodeType === 3) { // text
        if (parent._nodeName === 'code') {
          return this.text(child, output, {
            encodeEntityRef: true,
            pipe: true
          }
          )
        } else {
          return this.text(child, output,
            this.doNotEncode
              // do not encode text that is part of a template
              ? { encodeEntityRef: false }
              : { encodeEntityRef: true }
          )
        }
      } else if (nodeType === 8) { // comment
        return this.comment(child, output)
      }
    })
    if (indent) { return output.leave() }
  }

  text (node, output, options) {
    // console.log "text: #{node.data}"
    node.normalize()
    return this.writer.writeText(node, output, options)
  }

  comment (node, output) {
    const condition = node.data.match(/\s*\[(if\s+[^\]]+)\]/)
    if (!condition) {
      const data = node.data || ''
      if ((data.length === 0) || (data.search(/\r|\n/) === -1)) {
        return output.writeln(`// ${data.trim()}`)
      } else {
        output.writeln('//')
        output.enter()
        const lines = data.split(/\r|\n/)
        lines.forEach(line => {
          return this.writer.writeTextLine(node, line, output, {
            pipe: false,
            trim: true,
            wrap: false
          }
          )
        })
        return output.leave()
      }
    } else {
      return this.conditional(node, condition[1], output)
    }
  }

  conditional (node, condition, output) {
    // HACK: previous versions formally parsed content of conditional comments
    // which didn't work client-side and was also implicitly dependent on
    // parser operation being synchronous.
    //
    // Replacement hack converts conditional comments into element type 'conditional'
    // and relies on HTML DOM's innerHTML to parse textual content into DOM.
    let innerHTML = node.textContent.trim().replace(/\s*\[if\s+[^\]]+\]>\s*/, '').replace('<![endif]', '')
    // special-case handling of common conditional HTML element rick
    if (innerHTML.indexOf('<!') === 0) {
      condition = ` [${condition}] <!`
      innerHTML = null
    }
    const conditionalElem = node.ownerDocument.createElement('conditional')
    conditionalElem.setAttribute('condition', condition)
    if (innerHTML) { conditionalElem.innerHTML = innerHTML }
    return node.parentNode.insertBefore(conditionalElem, node.nextSibling)
  }

  script (node, output, tagHead, tagAttr) {
    output.writeln(`${tagHead}${tagAttr}.`)
    return this.writer.writeTextContent(node, output, {
      pipe: false,
      trim: true,
      wrap: false,
      escapeBackslash: true
    }
    )
  }

  style (node, output, tagHead, tagAttr) {
    output.writeln(`${tagHead}${tagAttr}.`)
    return this.writer.writeTextContent(node, output, {
      pipe: false,
      trim: true,
      wrap: false
    }
    )
  }
}

module.exports = Converter
