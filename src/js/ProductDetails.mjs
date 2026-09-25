import { getLocalStorage, setLocalStorage } from './utils.mjs';

export default class ProductDetails {
    constructor(productId, dataSource) {
        this.productId = productId;
        this.product = {};
        this.dataSource = dataSource;
    }

    async init() {
        this.product = await this.dataSource.findProductById(this.productId);
        this.renderProductDetails();

        document
            .getElementById('addToCart')
            .addEventListener('click', this.addProductToCart.bind(this));
    }

    addProductToCart() {
        const cart = getLocalStorage('so-cart') || [];
        cart.push(this.product);
        setLocalStorage('so-cart', cart);
    }

    renderProductDetails() {
        const product = this.product;

        document.querySelector('.product__brand').textContent =
            product.Brand.Name;

        document.querySelector('.product__name').textContent =
            product.NameWithoutBrand;

        const image = document.querySelector('.product__image');

        image.srcset = `
        ${product.Images.PrimarySmall} 80w,
        ${product.Images.PrimaryMedium} 160w,
        ${product.Images.PrimaryLarge} 320w,
        ${product.Images.PrimaryExtraLarge} 600w
    `;

        image.src = product.Images.PrimaryLarge;

        image.sizes = '(max-width: 600px) 160px, (max-width: 900px) 320px, 600px';

        image.alt = product.Name;

        document.querySelector('.product__price').textContent =
            `$${product.FinalPrice}`;

        document.querySelector('.product__color').textContent =
            product.Colors[0].ColorName;

        document.querySelector('.product__description').innerHTML =
            product.DescriptionHtmlSimple;
    }
}