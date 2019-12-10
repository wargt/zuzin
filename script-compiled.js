'use strict';
window.AkbarsForm = {
  init: function c(a) {
    var b = document.createElement('iframe');
    b.setAttribute('style', 'display: none'), b.setAttribute('id', 'MainPopupIframe'), document.getElementById(a.el).appendChild(b), window.addEventListener('message', function c(a) {
      var b = document.getElementById('MainPopupIframe');
      b.style.height = a.data + 'px'
    }), window.onload = function () {
      var b = document.getElementById('MainPopupIframe');
      b.src = 'https://abbnewstage.akbars.ru';
      b.src = b.src + 'individuals/' + a.category + '/form/' + a.product + '?nohead=1&iframe=1', b.onload = function () {
        b.style = 'width: 100%; display: block; border: none'
      }
    }
  }
};
