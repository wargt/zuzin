export default class SlideItem {

  constructor ({ elIndicator, elSlide, animationTime}) {
    this.elIndicator = elIndicator
    this.elSlide = elSlide
    this.animationTime = animationTime
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

      // включим активный слайд
      $$slide.addClass('active')

      // анимация активного индикатора
      $$indicator.find('.fill').transition({
        width: '100%'
      }, this.animationTime, 'linear', resolve)
    })
  }
}
