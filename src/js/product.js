import { getParam, loadHeaderFooter } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";

loadHeaderFooter();

const productId = getParam("product");
const category = getParam("category");

const dataSource = new ProductData(category);

const product = new ProductDetails(productId, dataSource);

product.init();