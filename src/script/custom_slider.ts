(($: JQueryStatic) => {
	class Slider {
		myName = 'Custom slider'
		private element: JQuery<HTMLElement>
		private inner: JQuery<HTMLElement>
		// TODO: add indecators
		// private indicators: JQuery<HTMLElement>
		private arrowPrev: JQuery<HTMLElement>
		private arrowNext: JQuery<HTMLElement>

		constructor(element: HTMLElement) {
			this.element = $(element);
			this.inner = this.element.children('.custom-slider-inner').first();
			this.arrowPrev = this.element.children('.custom-slider-control-prev').first();
			this.arrowNext = this.element.children('.custom-slider-control-next').first();

			this.arrowPrev.click((e) => { return this.toPrev(e) })
			this.arrowNext.click((e) => { return this.toNext(e) })

			this.element.on('animationend', (e) => {
				this.endTransition(e);
			})
		}

		private endTransition(e: JQuery.Event<HTMLElement, null>) {
			let target = $(e.target);
			if(this.element.hasClass('to-prev')) {
				target.appendTo(this.inner);
				this.element.removeClass('to-prev');
			} else {
				this.element.removeClass('to-next');
			}
		}

		public toNext(e: JQuery.Event<HTMLElement, null>) {
			this.element.addClass('to-prev')
			e.preventDefault();
		}
		public toPrev(e: JQuery.Event<HTMLElement, null>) {
			this.inner.children().last().prependTo(this.inner);
			this.element.addClass('to-next');
			e.preventDefault();
		}
	}

	function initSlider(this: HTMLElement) { new Slider(this) }

	$(() => {
		$('.custom-slider').each(initSlider)
	})
})($)
