export default class SlideItem {

  constructor ({ elIndicator, elSlide, animationTime = 5000, animateSlideFn, beforeAnimateSlideFn, afterAnimateSlideFn }) {
    this.elIndicator = elIndicator
    this.elSlide = elSlide
    this.animationTime = animationTime
    this.animateSlideFn = animateSlideFn
    this.beforeAnimateSlideFn = beforeAnimateSlideFn
    this.afterAnimateSlideFn = afterAnimateSlideFn
    this.$$activeIndicator = null
  }

  animateSlide (index) {

    return new Promise(resolve => {

      const $$indicator = $$(this.elIndicator)
      const $$slide = $$(this.elSlide)

      // сбросить все индикаторы
      const indicators = $$indicator.el.parentNode.children
      for (const i in indicators) {
        if (indicators.hasOwnProperty(i)) {
          const $indicator = indicators[i]

          if (i < index) {
            $$($indicator).find('.fill').css({ width: '100%' })
          } else {
            $$($indicator).find('.fill').css({ width: '0%' })
          }
        }
      }

      // сбросить все слайды
      const slides = $$slide.el.parentNode.children
      for (const $slide of slides) {
        $$($slide).removeClass('active')
      }

      this.beforeAnimateSlide()

      // включим активный слайд
      $$slide.addClass('active')

      this.startAnimateAdditional()

      // анимация активного индикатора
      this.$$activeIndicator = $$indicator.find('.fill')

      this.$$activeIndicator.transition({
        width: '100%'
      }, this.animationTime, 'linear', () => {

        this.$$activeIndicator = null

        resolve()

        this.afterAnimateSlide()
      })
    })
  }

  beforeAnimateSlide () {

    if (typeof this.beforeAnimateSlideFn === 'function') {

      this.beforeAnimateSlideFn({
        elIndicator: this.elIndicator,
        elSlide: this.elSlide,
        animationTime: this.animationTime
      })
    }
  }

  startAnimateAdditional () {
    if (typeof this.animateSlideFn === 'function') {

      this.animateSlideFn({
        elIndicator: this.elIndicator,
        elSlide: this.elSlide,
        animationTime: this.animationTime
      })
    }
  }

  afterAnimateSlide () {

    setTimeout(() => {

      if (typeof this.afterAnimateSlideFn === 'function') {

        this.afterAnimateSlideFn({
          elIndicator: this.elIndicator,
          elSlide: this.elSlide,
          animationTime: this.animationTime
        })
      }

    }, 200)
  }

  stopAnimation () {

    if (!this.$$activeIndicator) {
      return
    }

    this.$$activeIndicator.stopAnimation()

    this.afterAnimateSlide()
  }
}
