import '~/css/main.sass'
import DOMElement from '~/js/plugins/element'

window.$$ = element => new DOMElement(element)

console.log('hello world')

// $$('#js-slide-1').find('.fill').transition({
//   width: '100%'
// }, 10000, 'linear', () => {
//   console.log('finish animate')
// })
