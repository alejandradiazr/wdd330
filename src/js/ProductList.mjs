import { renderListWithTemplate } from './utils.mjs';

export default class ProductList {
    constructor(category, dataSource, listElement) {
        this.category = category;
        this.dataSource = dataSource;
        this.listElement = listElement;
    }

    async init() {
        const list = await this.dataSource.getData();
        this.renderList(list);
    }

    productCardTemplate(product) {
        return `<li class="product-card">
            <a href="product_pages/?product=${product.Id}">
                <img src="${import.meta.env.BASE_URL}${product.Image.replace(/^\//, '')}" alt="Image of ${product.Name}">
                <h2 class="card__brand">${product.Brand.Name}</h2>
                <h3 class="card__name">${product.NameWithoutBrand}</h3>
                <p class="product-card__price">$${product.FinalPrice}</p>
            </a>
        </li>`;
    }

    renderList(list) {
        renderListWithTemplate(
            this.productCardTemplate,
            this.listElement,
            list
        );
    }
}