import ProductFactory from "./product.factory";

describe("Product factory unit test", () => {
  it("should create a product", () => {
    const name = "Laptop";
    const price = 5000;

    const product = ProductFactory.create(name, price);

    expect(product.id).toBeDefined();
    expect(product.name).toBe(name);
    expect(product.price).toBe(price);
    expect(product.constructor.name).toBe("Product");
  });
});
