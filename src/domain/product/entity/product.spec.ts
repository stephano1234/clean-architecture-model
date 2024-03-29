import Product from "./product";

describe("Product unit tests", () => {
  const id = "123";
  const invalidId = "";
  const name = "Laptop";
  const invalidName = "";
  const price = 5000;
  const invalidPrice = -1;

  it("should throw error when id is empty", () => {
    expect(() => new Product(invalidId, name, price)).toThrowError("product: Id is required");
  });

  it("should throw error when name is empty", () => {
    expect(() => new Product(id, invalidName, price)).toThrowError("product: Name is required");
  });

  it("should throw error when price is less than zero", () => {
    expect(() => new Product(id, name, invalidPrice)).toThrowError("product: Price must be greater than zero");
  });

  it("should throw all product validation errors when all product properties are invalid", () => {
    expect(() => new Product(invalidId, invalidName, invalidPrice)).toThrowError("product: Id is required,product: Name is required,product: Price must be greater than zero");
  });

  it("should change name", () => {
    const product = new Product(id, name, price);
    const newName = "Cheaper Laptop";
    product.changeName(newName);
    expect(product.name).toBe(newName);
  });

  it("should throw error when changing to invalid name", () => {
    const product = new Product(id, name, price);
    expect(() => product.changeName(invalidName)).toThrowError("product: Name is required");
  });

  it("should change price", () => {
    const product = new Product(id, name, price);
    const newPrice = 1000;
    product.changePrice(newPrice);
    expect(product.price).toBe(newPrice);
  });

  it("should throw error when changing to invalid price", () => {
    const product = new Product(id, name, price);
    expect(() => product.changePrice(invalidPrice)).toThrowError("product: Price must be greater than zero");
  });

  it("should change name and price", () => {
    const product = new Product(id, name, price);
    const newName = "Cheaper Laptop";
    const newPrice = 1000;
    product.changeNameAndPrice(newName, newPrice);
    expect(product.name).toBe(newName);
    expect(product.price).toBe(newPrice);
  });

  it("should throw all errors when changing to invalid name and price", () => {
    const product = new Product(id, name, price);
    expect(() => product.changeNameAndPrice(invalidName, invalidPrice)).toThrowError("product: Name is required,product: Price must be greater than zero");
  });

});
