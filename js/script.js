window.onload = () => {

   const documentActions = (e) => {
      const targetElement = e.target;
      if (window.innerWidth > 768 && isMobile.any()) {
         if (targetElement.classList.contains('menu__arrow')) {
            targetElement.closest('.menu__item').classList.toggle('_hover');
         }
         if (!targetElement.closest('.menu__item') && document.querySelectorAll('.menu__item._hover').length > 0) {
            const activeMenuItem = document.querySelectorAll('.menu__item._hover');
            for (let i = 0; i < activeMenuItem.length; i++) {
               activeMenuItem[i].classList.remove('_hover');
            }
         }
      }
      if (targetElement.classList.contains('search-form__icon')) {
         document.querySelector('.search-form').classList.toggle('_active');
      } else if (!targetElement.closest('.search-form') && document.querySelector('.search-form._active')) {
         document.querySelector('.search-form').classList.remove('_active');
      }
      if (targetElement.classList.contains('products__more')) {
         getProducts(targetElement);
         e.preventDefault();
      }
      if (targetElement.classList.contains('actions-product__button')) {
         const productId = targetElement.closest('.item-product').dataset.pid;
         addToCart(targetElement, productId);
         e.preventDefault();
      }
      if (targetElement.classList.contains('cart-header__icon') || targetElement.closest('.cart-header__icon')) {
			if (document.querySelector('.cart-list').children.length > 0) {
				document.querySelector('.cart-header').classList.toggle('_active');
			}
			e.preventDefault();
		} else if (!targetElement.closest('.cart-header') && !targetElement.classList.contains('actions-product__button')) {
			document.querySelector('.cart-header').classList.remove('_active');
		}
      if (targetElement.classList.contains('cart-list__delete')) {
			const productId = targetElement.closest('.cart-list__item').dataset.cartPid;
			updateCart(targetElement, productId, false);
			e.preventDefault();
		}
   };
   document.addEventListener('click', documentActions);

   if (isMobile.any()) {
      const menuList = document.querySelector('.menu__list');

      menuList.addEventListener('click', (e) => {
         currentTarget = e.target;
         if (currentTarget.classList.contains('menu__arrow')) {
            currentTarget.classList.toggle('_active');
            currentTarget.nextElementSibling.classList.toggle('_active');
         }
      });
   }

   const headerElement = document.querySelector('.header');

	const callback = function (entries, observer) {
		if (entries[0].isIntersecting) {
			headerElement.classList.remove('_scroll');
		} else {
			headerElement.classList.add('_scroll');
		}
	};

	const headerObserver = new IntersectionObserver(callback);
	headerObserver.observe(headerElement);

   // Load More Products
	async function getProducts(button) {
		if (!button.classList.contains('_hold')) {
			button.classList.add('_hold');
			const file = "json/products.json";
			let response = await fetch(file, {
				method: "GET"
			});
			if (response.ok) {
				let result = await response.json();
				loadProducts(result);
				button.classList.remove('_hold');
				button.remove();
			} else {
				alert("Error");
			}
		}
	};

   function loadProducts(data) {
		const productsItems = document.querySelector('.products__items');

		data.products.forEach(item => {
			const productId = item.id;
			const productUrl = item.url;
			const productImage = item.image;
			const productTitle = item.title;
			const productText = item.text;
			const productPrice = item.price;
			const productOldPrice = item.priceOld;
			const productShareUrl = item.shareUrl;
			const productLikeUrl = item.likeUrl;
			const productLabels = item.labels;

			let productTemplateStart = `<article data-pid="${productId}" class="products__item item-product">`;
			let productTemplateEnd = `</article>`;

			let productTemplateLabels = '';
			if (productLabels) {
				let productTemplateLabelsStart = `<div class="item-product__labels">`;
				let productTemplateLabelsEnd = `</div>`;
				let productTemplateLabelsContent = '';

				productLabels.forEach(labelItem => {
					productTemplateLabelsContent += `<div class="item-product__label item-product__label_${labelItem.type}">${labelItem.value}</div>`;
				});

				productTemplateLabels += productTemplateLabelsStart;
				productTemplateLabels += productTemplateLabelsContent;
				productTemplateLabels += productTemplateLabelsEnd;
			}

			let productTemplateImage = `
            <a class="item-product__image" href="${productUrl}">
               <img src="img/products/${productImage}" alt="${productTitle}">
            </a>
         `;

			let productTemplateBodyStart = `<div class="item-product__body">`;
			let productTemplateBodyEnd = `</div>`;

			let productTemplateContent = `
            <div class="item-product__content">
               <h3 class="item-product__title">${productTitle}</h3>
               <div class="item-product__text">${productText}</div>
            </div>
         `;

			let productTemplatePrices = '';
			let productTemplatePricesStart = `<div class="item-product__prices">`;
			let productTemplatePricesCurrent = `<div class="item-product__price">Rp ${productPrice}</div>`;
			let productTemplatePricesOld = `<div class="item-product__price item-product__price--old">Rp ${productOldPrice}</div>`;
			let productTemplatePricesEnd = `</div>`;

			productTemplatePrices = productTemplatePricesStart;
			productTemplatePrices += productTemplatePricesCurrent;
			if (productOldPrice) {
				productTemplatePrices += productTemplatePricesOld;
			}
			productTemplatePrices += productTemplatePricesEnd;

			let productTemplateActions = `
            <div class="item-product__actions actions-product">
               <div class="actions-product__body">
                  <a class="actions-product__button btn btn--white" href="">Add to cart</a>
                  <a class="actions-product__link _icon-share" href="${productShareUrl}">Share</a>
                  <a class="actions-product__link _icon-favorite" href="${productLikeUrl}">Like</a>
               </div>
            </div>
         `;

			let productTemplateBody = '';
			productTemplateBody += productTemplateBodyStart;
			productTemplateBody += productTemplateContent;
			productTemplateBody += productTemplatePrices;
			productTemplateBody += productTemplateActions;
			productTemplateBody += productTemplateBodyEnd;

			let productTemplate = '';
			productTemplate += productTemplateStart;
			productTemplate += productTemplateLabels;
			productTemplate += productTemplateImage;
			productTemplate += productTemplateBody;
			productTemplate += productTemplateEnd;

			productsItems.insertAdjacentHTML('beforeend', productTemplate);

		});
   }

   // AddToCart
	function addToCart(productButton, productId) {
		if (!productButton.classList.contains('_hold')) {
			productButton.classList.add('_hold');
			productButton.classList.add('_fly');

			const cart = document.querySelector('.cart-header__icon');
			const product = document.querySelector(`[data-pid="${productId}"]`);
			const productImage = product.querySelector('.item-product__image');

			const productImageFly = productImage.cloneNode(true);

			const productImageFlyWidth = productImage.offsetWidth;
			const productImageFlyHeight = productImage.offsetHeight;
			const productImageFlyTop = productImage.getBoundingClientRect().top;
			const productImageFlyLeft = productImage.getBoundingClientRect().left;

			productImageFly.setAttribute('class', '_flyImage');
			productImageFly.style.cssText =
               `
            left: ${productImageFlyLeft}px;
            top: ${productImageFlyTop}px;
            width: ${productImageFlyWidth}px;
            height: ${productImageFlyHeight}px;
         `;

			document.body.append(productImageFly);

			const cartFlyLeft = cart.getBoundingClientRect().left;
			const cartFlyTop = cart.getBoundingClientRect().top;

			productImageFly.style.cssText =
               `
            left: ${cartFlyLeft}px;
            top: ${cartFlyTop}px;
            width: 0px;
            height: 0px;
            opacity:0;
         `;

			productImageFly.addEventListener('transitionend', function () {
				if (productButton.classList.contains('_fly')) {
					productImageFly.remove();
					updateCart(productButton, productId);
					productButton.classList.remove('_fly');
				}
			});
		}
	}

	function updateCart(productButton, productId, productAdd = true) {
		const cart = document.querySelector('.cart-header');
		const cartIcon = cart.querySelector('.cart-header__icon');
		const cartQuantity = cartIcon.querySelector('span');
		const cartProduct = document.querySelector(`[data-cart-pid="${productId}"]`);
		const cartList = document.querySelector('.cart-list');

		if (productAdd) {
			if (cartQuantity) {
				cartQuantity.innerHTML = ++cartQuantity.innerHTML;
			} else {
				cartIcon.insertAdjacentHTML('beforeend', `<span>1</span>`);
			}
			if (!cartProduct) {
				const product = document.querySelector(`[data-pid="${productId}"]`);
				const cartProductImage = product.querySelector('.item-product__image').innerHTML;
				const cartProductTitle = product.querySelector('.item-product__title').innerHTML;
				const cartProductContent = `
               <a class="cart-list__image" href="">${cartProductImage}</a>
               <div class="cart-list__body">
                  <a class="cart-list__title" href="">${cartProductTitle}</a>
                  <div class="cart-list__quantity">Quantity: <span>1</span></div>
                  <a class="cart-list__delete" href="">Delete</a>
               </div>`;
				cartList.insertAdjacentHTML('beforeend', `<li data-cart-pid="${productId}" class="cart-list__item">${cartProductContent}</li>`);
			} else {
				const cartProductQuantity = cartProduct.querySelector('.cart-list__quantity span');
				cartProductQuantity.innerHTML = ++cartProductQuantity.innerHTML;
			}

			productButton.classList.remove('_hold');
		} else {
			const cartProductQuantity = cartProduct.querySelector('.cart-list__quantity span');
			cartProductQuantity.innerHTML = --cartProductQuantity.innerHTML;
			if (!parseInt(cartProductQuantity.innerHTML)) {
				cartProduct.remove();
			}

			const cartQuantityValue = --cartQuantity.innerHTML;

			if (cartQuantityValue) {
				cartQuantity.innerHTML = cartQuantityValue;
			} else {
				cartQuantity.remove();
				cart.classList.remove('_active');
			}
		}
	}

	// Furniture Gallery
	const furniture = document.querySelector('.furniture__body');
	if (furniture && !isMobile.any()) {
		const furnitureItems = document.querySelector('.furniture__items');
		const furnitureColumn = document.querySelectorAll('.furniture__column');

		const speed = furniture.dataset.speed;

		let positionX = 0;
		let coordXprocent = 0;

		function setMouseGalleryStyle() {
			let furnitureItemsWidth = 0;
			furnitureColumn.forEach(element => {
				furnitureItemsWidth += element.offsetWidth;
			});

			const furnitureDifferent = furnitureItemsWidth - furniture.offsetWidth;
			const distX = Math.floor(coordXprocent - positionX);

			positionX = positionX + (distX * speed);
			let position = furnitureDifferent / 200 * positionX;

			furnitureItems.style.cssText = `transform: translate3d(${-position}px,0,0);`;

			if (Math.abs(distX) > 0) {
				requestAnimationFrame(setMouseGalleryStyle);
			} else {
				furniture.classList.remove('_init');
			}
		}
		furniture.addEventListener("mousemove", function (e) {
			const furnitureWidth = furniture.offsetWidth;

			const coordX = e.pageX - furnitureWidth / 2;

			coordXprocent = coordX / furnitureWidth * 200;

			if (!furniture.classList.contains('_init')) {
				requestAnimationFrame(setMouseGalleryStyle);
				furniture.classList.add('_init');
			}
		});
	}
};
const body   = document.querySelector('body');
const burger = document.querySelector('.icon-menu');
const menu   = document.querySelector('.menu__body');

burger.addEventListener('click', () => {
   body.classList.toggle('_lock');
   burger.classList.toggle('_active');
   menu.classList.toggle('_active');
});
new Swiper('.slider-main__body', {
	// Optional parameters
	observer: true,
	observeParents: true,
	loop: true,
	loopAdditionalSlides: 5,
	slidesPerView: 1,
	speed: 800,
	spaceBetween: 32,
	watchOverflow: true,
	parallax: true,
	preloadImages: false,
	// If we need pagination
	pagination: {
	  el: '.controls-slider-main__dotts',
	  clickable: true,
	},
	// Navigation arrows
	navigation: {
	  nextEl: '.slider-main .slider-arrow__next',
	  prevEl: '.slider-main .slider-arrow__prev',
	},

});

new Swiper('.slider-rooms__body', {
	// Optional parameters
	observer: true,
	observeParents: true,
	loop: true,
	loopAdditionalSlides: 5,
	slidesPerView: 'auto',
	speed: 800,
	spaceBetween: 24,
	watchOverflow: true,
	parallax: true,
	preloadImages: false,
	// If we need pagination
	pagination: {
	  el: '.slider-rooms__dots',
	  clickable: true,
	},
	// Navigation arrows
	navigation: {
	  nextEl: '.slider-rooms .slider-arrow__next',
	  prevEl: '.slider-rooms .slider-arrow__prev',
	},

});

new Swiper('.slider-tips__body', {
	// Optional parameters
	observer: true,
	observeParents: true,
	loop: true,
	slidesPerView: 3,
	speed: 800,
	spaceBetween: 32,
	watchOverflow: true,
	// If we need pagination
	pagination: {
	  el: '.slider-tips__dotts',
	  clickable: true,
	},
	// Navigation arrows
	navigation: {
	  nextEl: '.slider-tips .slider-arrow__next',
	  prevEl: '.slider-tips .slider-arrow__prev',
	},
	breakpoints: {
		// when window width is >= 320px
		320: {
			slidesPerView: 1.1,
			spaceBetween: 15
		},
		// when window width is >= 768px
		768: {
			slidesPerView: 2,
			spaceBetween: 20
		},
		// when window width is >= 992px
		992: {
			slidesPerView: 3,
			spaceBetween: 32
		}
	}
});
// Dynamic Adapt v.1
// HTML data-da="where(uniq class name),when(breakpoint),position(digi)"
// e.x. data-da=".item,992,2"
// Andrikanych Yevhen 2020
// https://www.youtube.com/c/freelancerlifestyle

"use strict";

function DynamicAdapt(type) {
	this.type = type;
}

DynamicAdapt.prototype.init = function () {
	const _this = this;
	this.objects = [];
	this.daClassname = "_dynamic_adapt_";
	this.nodes = document.querySelectorAll("[data-da]");

	for (let i = 0; i < this.nodes.length; i++) {
		const node = this.nodes[i];
		const data = node.dataset.da.trim();
		const dataArray = data.split(",");
		const object = {};
		object.element = node;
		object.parent = node.parentNode;
		object.destination = document.querySelector(dataArray[0].trim());
		object.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
		object.place = dataArray[2] ? dataArray[2].trim() : "last";
		object.index = this.indexInParent(object.parent, object.element);
		this.objects.push(object);
	}

	this.arraySort(this.objects);

	this.mediaQueries = Array.prototype.map.call(this.objects, function (item) {
		return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
	}, this);
	this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
		return Array.prototype.indexOf.call(self, item) === index;
	});

	for (let i = 0; i < this.mediaQueries.length; i++) {
		const media = this.mediaQueries[i];
		const mediaSplit = String.prototype.split.call(media, ',');
		const matchMedia = window.matchMedia(mediaSplit[0]);
		const mediaBreakpoint = mediaSplit[1];

		const objectsFilter = Array.prototype.filter.call(this.objects, function (item) {
			return item.breakpoint === mediaBreakpoint;
		});
		matchMedia.addListener(function () {
			_this.mediaHandler(matchMedia, objectsFilter);
		});
		this.mediaHandler(matchMedia, objectsFilter);
	}
};

DynamicAdapt.prototype.mediaHandler = function (matchMedia, objects) {
	if (matchMedia.matches) {
		for (let i = 0; i < objects.length; i++) {
			const object = objects[i];
			object.index = this.indexInParent(object.parent, object.element);
			this.moveTo(object.place, object.element, object.destination);
		}
	} else {
		for (let i = 0; i < objects.length; i++) {
			const object = objects[i];
			if (object.element.classList.contains(this.daClassname)) {
				this.moveBack(object.parent, object.element, object.index);
			}
		}
	}
};

DynamicAdapt.prototype.moveTo = function (place, element, destination) {
	element.classList.add(this.daClassname);
	if (place === 'last' || place >= destination.children.length) {
		destination.insertAdjacentElement('beforeend', element);
		return;
	}
	if (place === 'first') {
		destination.insertAdjacentElement('afterbegin', element);
		return;
	}
	destination.children[place].insertAdjacentElement('beforebegin', element);
}

DynamicAdapt.prototype.moveBack = function (parent, element, index) {
	element.classList.remove(this.daClassname);
	if (parent.children[index] !== undefined) {
		parent.children[index].insertAdjacentElement('beforebegin', element);
	} else {
		parent.insertAdjacentElement('beforeend', element);
	}
}

DynamicAdapt.prototype.indexInParent = function (parent, element) {
	const array = Array.prototype.slice.call(parent.children);
	return Array.prototype.indexOf.call(array, element);
};

DynamicAdapt.prototype.arraySort = function (arr) {
	if (this.type === "min") {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return -1;
				}

				if (a.place === "last" || b.place === "first") {
					return 1;
				}

				return a.place - b.place;
			}

			return a.breakpoint - b.breakpoint;
		});
	} else {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return 1;
				}

				if (a.place === "last" || b.place === "first") {
					return -1;
				}

				return b.place - a.place;
			}

			return b.breakpoint - a.breakpoint;
		});
		return;
	}
};

const da = new DynamicAdapt("max");
da.init();
if (window.innerWidth < 768 && isMobile.any()) {
   const menuFooterBtns = document.querySelectorAll('.menu-footer__title');
   for (let i = 0; i < menuFooterBtns.length; i++) {
      const currentBtn = menuFooterBtns[i];
      currentBtn.classList.add('_init');
      currentBtn.addEventListener('click', () => {
         currentBtn.classList.toggle('_active');
         currentBtn.nextElementSibling.classList.toggle('_active');
      });
   }
}
lightGallery(document.getElementById('lightgallery'), {
   selector: '.row-furniture__item'
});