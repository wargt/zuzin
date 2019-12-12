import '~/css/main.sass'
import 'babel-polyfill'
import DOMElement from '~/js/plugins/element'
import SlideItem from './slide-item'

window.$$ = element => new DOMElement(element)

window.linkClicked = (e) => {
  e.stopPropagation()
}

window.changeSlideClicked = (e, slideIndex) => {
  e.stopPropagation()
  e.preventDefault()

  window.slider.changeSlideClicked(slideIndex)

  return false
}

class Slider {

  constructor () {
    this.slides = []
    this.activeSlideIndex = 0
    this.$bgAnimEl = null

    this.addSlideItem({
      elIndicator: '#js-slide-indicator-1',
      elSlide: '#js-slide-1',
      animationTime: 6000
    })

    this.addSlideItem({
      elIndicator: '#js-slide-indicator-2',
      elSlide: '#js-slide-2',
      animationTime: 6000
    })

    this.addSlideItem({
      elIndicator: '#js-slide-indicator-3',
      elSlide: '#js-slide-3',
      beforeAnimateSlideFn: this.beforeAnimateBg,
      animateSlideFn: this.animateBg,
      afterAnimateSlideFn: this.afterAnimateBg,
      animationTime: 7000
    })

    this.addSlideItem({
      elIndicator: '#js-slide-indicator-4',
      elSlide: '#js-slide-4',
      animationTime: 7000
    })

    this.animateSlide()

    $$('#js-slider-wrp').el.addEventListener('click', this.nextClicked.bind(this))

    $$('#js-menu-icon').el.addEventListener('click', this.menuClicked.bind(this))
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
      scale: 1.5,
      rotate: '-15deg'
    })
  }

  animateBg ({ elSlide, animationTime }) {

    this.$bgAnimEl = $$(elSlide).find('.bg__slide')

    this.$bgAnimEl.transition({
      scale: 0.8,
      rotate: '-15deg'
    }, animationTime, 'ease-out')
  }

  afterAnimateBg () {

    if (!this.$bgAnimEl) {
      return
    }

    this.$bgAnimEl.stopAnimation().css({
      scale: 1.5,
      rotate: '-15deg'
    })

    this.$bgAnimEl = null
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

  changeSlideClicked (slideIndex) {

    const slide = this.slides[this.activeSlideIndex]

    if (slide) {
      slide.stopAnimation()
    }

    this.activeSlideIndex = slideIndex

    this.animateSlide()

    this.menuClicked()
  }

  menuClicked () {
    const $$menu = $$('#js-menu-icon')

    if ($$menu.hasClass('opened')) {
      $$menu.removeClass('opened')
      $$('#js-menu').hide()
    } else {
      $$menu.addClass('opened')
      $$('#js-menu').css({
        display: 'flex'
      })
    }
  }
}

window.slider = new Slider()


