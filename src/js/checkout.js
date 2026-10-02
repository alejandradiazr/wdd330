import { loadHeaderFooter } from './utils.mjs';
import CheckoutProcess from './CheckoutProcess.mjs';

loadHeaderFooter();

const checkout = new CheckoutProcess('so-cart', '.checkout');
checkout.init();

const zipInput = document.querySelector('#zip');

zipInput.addEventListener('blur', () => {
    checkout.calculateOrderTotal();
});

const form = document.forms.checkout;

form.addEventListener('submit', (event) => {
    event.preventDefault();
    checkout.checkout(form);
});