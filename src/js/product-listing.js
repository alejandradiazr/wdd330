import { getParam, loadHeaderFooter } from './utils.mjs';
import ProductData from './ProductData.mjs';

loadHeaderFooter();

const category = getParam('category');

const dataSource = new ProductData(category);

async function init() {
  const products = await dataSource.getData();

  const productList = document.querySelector('.product-list');

  document.querySelector('h2').textContent =
    `Top Products: ${category.replace('-', ' ').replace(/\b\w/g, (char) => char.toUpperCase())}`;

  productList.innerHTML = products
    .map(
      (product) => `
        <li class="product-card">
          <a href="../product_pages/?product=${product.Id}&category=${category}">
            <img src="${product.Images.PrimaryMedium}" alt="${product.Name}" />
            <h3 class="card__brand">${product.Brand.Name}</h3>
            <h2 class="card__name">${product.NameWithoutBrand}</h2>
            <p class="product-card__price">$${product.FinalPrice}</p>
          </a>
        </li>
      `,
    )
    .join('');
}

init();