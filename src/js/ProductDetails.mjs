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
        image.src = product.Images.PrimaryLarge;
        image.alt = product.Name;

        document.querySelector('.product__price').textContent =
            `$${product.FinalPrice}`;

        document.querySelector('.product__color').textContent =
            product.Colors[0].ColorName;

        document.querySelector('.product__description').innerHTML =
            product.DescriptionHtmlSimple;
    }
}