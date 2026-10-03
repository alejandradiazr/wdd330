import {
    getLocalStorage,
    removeLocalStorage,
    alertMessage,
} from './utils.mjs';

import ExternalServices from './ExternalServices.mjs';

function formDataToJSON(formElement) {
    const formData = new FormData(formElement);
    return Object.fromEntries(formData);
}

export default class CheckoutProcess {
    constructor(key, outputSelector) {
        this.key = key;
        this.outputSelector = outputSelector;
        this.list = [];
        this.itemTotal = 0;
        this.shipping = 0;
        this.tax = 0;
        this.orderTotal = 0;
    }

    init() {
        this.list = getLocalStorage(this.key) || [];
        this.calculateItemSubTotal();
    }

    async checkout(form) {
        const order = formDataToJSON(form);
        order.orderDate = new Date().toISOString();
        order.orderTotal = this.orderTotal;
        order.tax = this.tax;
        order.shipping = this.shipping;
        order.items = this.packageItems(this.list);
        const service = new ExternalServices();

        try {
            const response = await service.checkout(order);
            console.log('Order response:', response);

            removeLocalStorage(this.key);
            window.location.href = './success.html';

            return response;
        }

        catch (err) {
            console.error('Checkout error:', err);

            const messages =
                err.message && typeof err.message === 'object'
                    ? Object.values(err.message)
                    : [err.message || 'Unable to place your order.'];

            messages.forEach((message) => alertMessage(message));
        }
    }

    packageItems(items) {
        return items.map((item) => ({
            id: item.Id,
            name: item.Name,
            price: Number(item.FinalPrice),
            quantity: 1,
        }));
    }

    calculateItemSubTotal() {
        this.itemTotal = this.list.reduce(
            (sum, item) => sum + Number(item.FinalPrice),
            0
        );

        const subtotal = document.querySelector(
            `${this.outputSelector} #subtotal`
        );

        subtotal.innerText = `$${this.itemTotal.toFixed(2)}`;
    }

    calculateOrderTotal() {
        this.tax = this.itemTotal * 0.06;

        this.shipping = this.list.length > 0
            ? 10 + (this.list.length - 1) * 2
            : 0;

        this.orderTotal = this.itemTotal + this.tax + this.shipping;

        this.displayOrderTotals();
    }

    displayOrderTotals() {
        const tax = document.querySelector(`${this.outputSelector} #tax`);
        const shipping = document.querySelector(
            `${this.outputSelector} #shipping`
        );
        const orderTotal = document.querySelector(
            `${this.outputSelector} #orderTotal`
        );

        tax.innerText = `$${this.tax.toFixed(2)}`;
        shipping.innerText = `$${this.shipping.toFixed(2)}`;
        orderTotal.innerText = `$${this.orderTotal.toFixed(2)}`;
    }
}