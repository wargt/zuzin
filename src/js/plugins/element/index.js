import AnimateElement from './animate.js'

const isArray = (value) => {
  return Object.prototype.toString.call(value) === "[object Array]"
}

export default class DOMElement extends AnimateElement {

  constructor (element) {
    super()

    if (isArray(element)) {

      const elements = []

      for (const i in element) {

        elements.push(this._getElement(element[i]))
      }

      this.el = elements

    } else if (element instanceof DOMElement) {

      const elements = []

      for (const i in element.el) {

        elements.push(this._getElement(element.el[i]))
      }

      this.el = elements

    } else if (typeof element === 'string') {

      this.el = this.find(element, false)

    } else {

      this.el = this._getElement(element)
    }
  }

  _getElement (el) {

    if (!el) {
      return null
    }

    return typeof el._isVue !== 'undefined' ? el.$el : el
  }

  offset () {
    var docElem, win,
      elem = this.el,
      box = { top: 0, left: 0 },
      doc = elem && elem.ownerDocument;

    if (!doc) {
      return;
    }

    docElem = doc.documentElement;

    // Support: BlackBerry 5, iOS 3 (original iPhone)
    // If we don't have gBCR, just use 0,0 rather than error
    if (typeof elem.getBoundingClientRect !== 'undefined') {
      box = elem.getBoundingClientRect();
    }
    win = window;

    return {
      top: box.top + win.pageYOffset - docElem.clientTop,
      left: box.left + win.pageXOffset - docElem.clientLeft
    }
  }

  empty () {
    this.each(el => el.innerHTML = '')
    return this
  }

  each (callback) {

    if (isArray(this.el) || this.el instanceof HTMLCollection) {

      for (var i in this.el) {

        if (this.el[i] instanceof HTMLElement) {

          callback(this.el[i])
        }
      }

    } else if (this.el) {

      callback(this.el)
    }

    return this
  }

  addClass (className) {

    this.each(function (element) {
      element.classList.add(className)
    })

    return this
  }

  hasClass (className) {

    var has = true

    this.each(function (element) {
      if (!element.classList.contains(className)) {
        has = false
      }
    })

    return has
  }

  removeClass (className) {

    this.each(function (element) {
      element.classList.remove(className)
    })

    return this
  }

  removeAttr (attr) {

    this.each(function (element) {

      if (attr == 'style') {
        element.style.cssText = null
      } else {
        element.removeAttribute(attr)
      }
    })

    return this
  }

  height (value = null) {

    if (!value) {

      let height = 0

      this.each(el => height = el.clientHeight) //offsetHeight clientHeight

      return height
    }

    value = this.unit(value, 'px')

    this.each(el => el.style.height = value)

    return this
  }

  width (value = null) {

    if (!value) {

      let width = 0

      this.each(el => {
        width = el.offsetWidth
      })

      return width //offsetWidth clientWidth
    }

    value = this.unit(value, 'px')

    this.each(el => el.style.width = value)

    return this
  }

  isScrollVisible (offsetBottom = 250) {

    const offset = this.offset()

    const videoScroll = offset.top + (this.el.offsetHeight / 2)

    const scrollY = (typeof window.scrollY == 'undefined') ? window.pageYOffset : window.scrollY

    const scrollWindow = scrollY + window.innerHeight - offsetBottom

    return scrollWindow >= videoScroll
  }

  scrollTo (time = 400, offset = 0) {

    let { top } = this.offset()

    top += offset

    if (+time === 0) {

      window.scrollTo(0, 0)

    } else {

      console.log('eded')
    }
  }

  show () {

    this.each(element => element.style.display = "block")

    return this
  }

  hide () {

    this.each(element => element.style.display = "none")

    return this
  }

  html (value) {

    if (!value) {
      let innerHTML

      this.each(element => {
        innerHTML = element.innerHTML
      })

      return innerHTML
    }

    this.each(element => {
      element.innerHTML = value
    })

    return this
  }

  find (selector, returnClass = true) {

    if (selector[0] == '.') {
      return this.findByClass(selector, returnClass)
    }

    if (selector[0] == '#') {
      return this.findById(selector, returnClass)
    }

    return null
  }

  findByClass (selector, returnClass = true) {

    selector = selector.substring(1)

    if (this.el) {

      var el = this.el.getElementsByClassName(selector)

    } else {

      var el = document.getElementsByClassName(selector)
    }

    if (!returnClass) {

      return el
    }

    return new DOMElement(el)
  }

  findById (selector, returnClass = true) {
    selector = selector.substring(1)

    if (this.el) {

      var el = this.el.querySelector('#' + selector)

    } else {

      var el = document.getElementById(selector)
    }

    if (!returnClass) {

      return el
    }

    return new DOMElement(el)
  }

  isVisible () {

    const style = window.getComputedStyle(this.el)

    return style['display'] !== 'none'
  }
}
