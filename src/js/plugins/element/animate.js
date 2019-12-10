const aconfig = (function () {

  if (!process.browser) {
    return {}
  }

  var div = document.createElement('div')

  var config = {
    useTransitionEnd: false //видидо setTimeout надежнее всех )
  }

  var support = {}
  support.transition = getVendorPropertyName('transition');
  support.transitionDelay = getVendorPropertyName('transitionDelay');
  support.transform = getVendorPropertyName('transform');
  support.csstransform = getCssTransform(support.transform);
  support.transformOrigin = getVendorPropertyName('transformOrigin');
  support.filter = getVendorPropertyName('Filter');
  support.transform3d = checkTransform3dSupport();
  config['support'] = support


  var eventNames = {
    'transition': 'transitionend',
    'MozTransition': 'transitionend',
    'OTransition': 'oTransitionEnd',
    'WebkitTransition': 'webkitTransitionEnd',
    'msTransition': 'MSTransitionEnd'
  };
  config['eventNames'] = eventNames

  config['transitionEnd'] = support.transitionEnd = eventNames[support.transition] || null;


  var propertyMap = {
    marginLeft: 'margin',
    marginRight: 'margin',
    marginBottom: 'margin',
    marginTop: 'margin',
    paddingLeft: 'padding',
    paddingRight: 'padding',
    paddingBottom: 'padding',
    paddingTop: 'padding'
  };
  config['propertyMap'] = propertyMap


  var cssProps = {
    boxSizing: "boxSizing",
    display: "display",
    float: "cssFloat",
    height: "height",
    'transit:transform': "transit:transform",
    x: "x"
  };
  config['cssProps'] = cssProps

  //ед измерения
  var props = {
    width: { unit: 'px' },
    height: { unit: 'px' },
    marginBottom: { unit: 'px' },
    rotate: { unit: 'deg', prop: support.csstransform, 'pattern': 'rotate($1)' },
    scale: { prop: support.csstransform, 'pattern': 'scale($1)' },
    x: { unit: 'px', prop: support.csstransform, 'pattern': 'translateX($1)' },
    y: { unit: 'px', prop: support.csstransform, 'pattern': 'translateY($1)' }
  };

  config['props'] = props

  registerCssHook('scale');
  registerCssHook('scaleX');
  registerCssHook('scaleY');
  registerCssHook('translate');
  registerCssHook('rotate');
  registerCssHook('rotateX');
  registerCssHook('rotateY');
  registerCssHook('rotate3d');
  registerCssHook('perspective');
  registerCssHook('skewX');
  registerCssHook('skewY');
  registerCssHook('x', true);
  registerCssHook('y', true);

  function getVendorPropertyName (prop) {

    // Handle unprefixed versions (FF16+, for example)
    //if (prop in div.style) return prop;

    var prefixes = ['Moz', 'Webkit', 'O', 'ms'];
    var prop_ = prop.charAt(0).toUpperCase() + prop.substr(1);

    for (var i = 0; i < prefixes.length; ++i) {
      var vendorProp = prefixes[i] + prop_;
      if (vendorProp in div.style) {
        return vendorProp;
      }
    }
  }

  function getCssTransform (prop) {

    var props = {
      'WebkitTransform': '-webkit-transform',
      'MozTransform': '-moz-transform',
      'OTransform': '-o-transform',
      'msTransform': '-ms-transform'
    }

    return props[prop] ? props[prop] : prop
  }

  function checkTransform3dSupport () {
    div.style[support.transform] = '';
    div.style[support.transform] = 'rotateY(90deg)';
    return div.style[support.transform] !== '';
  }

  function registerCssHook (prop, isPixels) {
    propertyMap[prop] = support.transform;
  }

  return config
})()

export default class AnimateElement {

  constructor () {
    this.c = aconfig
    this.transitionTimeout = null
  }

  //остановить анимацию предыдущую
  stopAnimation () {

    if (this.transitionTimeout) {
      clearTimeout(this.transitionTimeout)
      this.transitionTimeout = null
    }

    return this
  }

  transition (properties, duration, easing, callback) {

    var self = this;
    var delay = 0;

    var theseProperties = Object.assign({}, {}, properties)

    // Account for `.transition(properties, callback)`.
    if (typeof duration === 'function') {
      callback = duration;
      duration = undefined;
    }

    // Account for `.transition(properties, duration, callback)`.
    if (typeof easing === 'function') {
      callback = easing;
      easing = undefined;
    }

    if (typeof theseProperties.delay !== 'undefined') {
      delay = theseProperties.delay;
      delete theseProperties.delay;
    }

    if (typeof duration === 'undefined') {
      duration = 400;
    }
    if (typeof easing === 'undefined') {
      easing = 'ease';
    }

    duration = this.toMS(duration)

    var transitionValue = this.getTransition(theseProperties, duration, easing, delay);

    var work = this.c.support.transition;
    var i = work ? (parseInt(duration, 10) + parseInt(delay, 10)) : 0;

    var oldTransitions = {};

    var run = function (nextCall) {
      var bound = false;

      // Prepare the callback.
      var cb = function () {
        if (bound) {
          self.each(function (element) {
            element.removeEventListener(self.c.transitionEnd, cb)
          })
        }

        if (i > 0) {
          self.each(function (element) {
            element.style[self.c.support.transition] = (oldTransitions[this] || null);
          });
        }

        if (typeof callback === 'function') {
          callback.apply(self);
        }
        if (typeof nextCall === 'function') {
          nextCall();
        }
      };

      if ((i > 0) && (self.c.transitionEnd) && (self.c.useTransitionEnd)) {
        // Use the 'transitionend' event if it's available.
        bound = true;
        self.each(function (element) {
          element.addEventListener(self.c.transitionEnd, cb)
        });
      } else {
        // Fallback to timers if the 'transitionend' event isn't supported.

        if (self.transitionTimeout) {
          clearTimeout(self.transitionTimeout)
          self.transitionTimeout = null
        }

        self.transitionTimeout = window.setTimeout(cb, i);
      }

      // Apply transitions.
      self.each(function (element) {

        if (i > 0) {

          element.style[self.c.support.transition] = transitionValue;
        }

        self.css(theseProperties)
      });
    };

    // this.offsetWidth = this.offsetWidth; // force a repaint
    setTimeout(run, 100); //run(next);

    return this
  }

  css (props) {

    var res = {};

    for (var key in props) {

      var val = props[key]

      var registered_prop = this.c.props[key]

      //registered
      if (registered_prop) {

        if (registered_prop.unit) {
          val = this.unit(val, registered_prop.unit)
        }

        //merge
        if (registered_prop.prop) {

          if (!res[registered_prop.prop]) {
            res[registered_prop.prop] = '';
          }

          if (registered_prop.pattern) {
            val = registered_prop.pattern.replace('$1', val)
          } else {
            val = key + ':' + val
          }

          res[registered_prop.prop] += ' ' + val

        } else {

          res[key] = val
        }

      } else {

        res[key] = val
      }
    }

    var r = []

    for (var k in res) {
      r.push(k + ':' + res[k]);
    }

    r = r.join(';')

    this.each(element => element.style.cssText += r)

    return this
  }

  formProps (props) {

    var res = []

    for (var key in props) {

      var val = props[key]

      res.push(key + ':' + val + ';')
    }

    return res.join('')
  }

  getTransition (properties, duration = 350, easing = 'ease', delay = 0) {

    var props = this.getProperties(properties);

    var attribs = '' + this.toMS(duration) + ' ' + easing;

    if (parseInt(delay, 10) > 0) {
      attribs += ' ' + this.toMS(delay);
    }

    var transitions = []

    for (var i in props) if (props.hasOwnProperty(i)) {

      var name = props[i]

      transitions.push(name + ' ' + attribs);
    }

    return transitions.join(', ');
  }

  getProperties (props) {
    var re = {};

    for (var key in props) {
      key = this.c.propertyMap[key] || this.c.cssProps[key] || key;

      key = this.getCssTransform(key)

      if (this.c.support[key]) {

        key = this.uncamel(this.c.support[key])
      }

      re[key] = true
    }

    return Object.keys(re)
  }

  getCssTransform (prop) {

    var props = {
      'WebkitTransform': '-webkit-transform',
      'MozTransform': '-moz-transform',
      'OTransform': '-o-transform',
      'msTransform': '-ms-transform'
    }

    return props[prop] ? props[prop] : prop
  }

  uncamel (str) {
    return str.replace(/([A-Z])/g, function (letter) {
      return '-' + letter.toLowerCase();
    });
  }

  unit (i, units) {
    if ((typeof i === "string") && (!i.match(/^[\-0-9\.]+$/))) {
      return i;
    } else {
      return "" + i + units;
    }
  }

  toMS (duration) {
    var i = duration;

    return this.unit(i, 'ms');
  }
}
