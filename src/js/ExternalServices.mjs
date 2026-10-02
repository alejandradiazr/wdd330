function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export default class ExternalServices {
  constructor(category) {
    this.category = category;
    this.path = `${import.meta.env.VITE_SERVER_URL}products/search/${category}`;
  }

  getData() {
    return fetch(this.path)
      .then(convertToJson)
      .then((data) => data.Result);
  }

  checkout(payload) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    return fetch(
      'https://wdd330-backend-osp8.onrender.com/checkout',
      options
    ).then(convertToJson);
  }

  async findProductById(id) {
    const products = await this.getData();
    return products.find((item) => item.Id === id);
  }
}