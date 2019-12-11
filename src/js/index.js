import '~/css/main.sass'
import 'babel-polyfill'
import DOMElement from '~/js/plugins/element'
import SlideItem from './slide-item'

window.$$ = element => new DOMElement(element)

window.linkClicked = (e) => {
  e.stopPropagation()
}

class Slider {

  constructor () {
    this.slides = []
    this.activeSlideIndex = 0
    this.$bgAnimEl = null

    this.addSlideItem({
      elIndicator: '#js-slide-indicator-1',
      elSlide: '#js-slide-1',
      animationTime: 5000
    })

    this.addSlideItem({
      elIndicator: '#js-slide-indicator-2',
      elSlide: '#js-slide-2',
      animationTime: 5000
    })

    this.addSlideItem({
      elIndicator: '#js-slide-indicator-3',
      elSlide: '#js-slide-3',
      beforeAnimateSlideFn: this.beforeAnimateBg,
      animateSlideFn: this.animateBg,
      afterAnimateSlideFn: this.afterAnimateBg,
      animationTime: 8000
    })

    this.addSlideItem({
      elIndicator: '#js-slide-indicator-4',
      elSlide: '#js-slide-4',
      animationTime: 8000
    })

    this.animateSlide()

    $$('#js-slider-wrp').el.addEventListener('click', this.nextClicked.bind(this))
  }

  addSlideItem (args) {
    this.slides.push(new SlideItem(args))
  }

  async animateSlide () {
    const slide = this.slides[this.activeSlideIndex]

    if (!slide) {
      return
    }

    await slide.animateSlide(this.activeSlideIndex)

    if (this.slides[this.activeSlideIndex + 1]) {

      this.activeSlideIndex = this.activeSlideIndex + 1

    } else {

      this.activeSlideIndex = 0
    }

    this.animateSlide()
  }

  beforeAnimateBg ({ elSlide }) {

    $$(elSlide).find('.bg__slide').css({
      scale: 2,
      rotate: '-15deg'
    })
  }

  animateBg ({ elSlide, animationTime }) {

    this.$bgAnimEl = $$(elSlide).find('.bg__slide')

    this.$bgAnimEl.transition({
      scale: 1,
      rotate: '-15deg'
    }, animationTime - 1000, 'linear')
  }

  afterAnimateBg () {

    if (!this.$bgAnimEl) {
      return
    }

    this.$bgAnimEl.stopAnimation().css({
      scale: 2,
      rotate: '-15deg'
    })

    this.$bgAnimEl = null

    console.log('afterAnimateBg')
  }

  nextClicked () {

    const slide = this.slides[this.activeSlideIndex]

    if (slide) {
      slide.stopAnimation()
    }

    if (this.slides[this.activeSlideIndex + 1]) {

      this.activeSlideIndex = this.activeSlideIndex + 1

    } else {

      this.activeSlideIndex = 0
    }

    this.animateSlide()
  }
}

new Slider()


