import '~/css/main.sass'
import 'babel-polyfill'
import DOMElement from '~/js/plugins/element'
import SlideItem from './slide-item'

window.$$ = element => new DOMElement(element)

class Slider {

  constructor () {
    this.slides = []

    this.addSlideItem({
      elIndicator: '#js-slide-indicator-1',
      elSlide: '#js-slide-1'
    })

    this.addSlideItem({
      elIndicator: '#js-slide-indicator-2',
      elSlide: '#js-slide-2'
    })

    this.addSlideItem({
      elIndicator: '#js-slide-indicator-3',
      elSlide: '#js-slide-3'
    })

    this.addSlideItem({
      elIndicator: '#js-slide-indicator-4',
      elSlide: '#js-slide-4',
      animationTime: 8000
    })

    this.animateSlide(0)
  }

  addSlideItem ({ elIndicator, elSlide, animationTime = 5000 }) {
    this.slides.push(new SlideItem({ elIndicator, elSlide, animationTime }))
  }

  async animateSlide (index) {
    const slide = this.slides[index]

    if (!slide) {
      return
    }

    await slide.animateSlide(index)

    if (this.slides[index + 1]) {

      this.animateSlide(index + 1)

    } else {

      this.animateSlide(0)
    }
  }
}

new Slider()


