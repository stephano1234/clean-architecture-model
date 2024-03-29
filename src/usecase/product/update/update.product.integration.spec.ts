import { Sequelize } from "sequelize-typescript";
import ProductFactory from "../../../domain/product/factory/product.factory";
import { InputUpdateProductDto } from "./update.product.dto";
import UpdateProductUseCase from "./update.product.usecase";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";

const product = ProductFactory.create(
  "Laptop",
  5000,
);

describe("Integration test for product update use case", () => {
  let input: InputUpdateProductDto;
  let sequelize: Sequelize;

  beforeEach(() => {
    input = {
      id: product.id,
      name: product.name,
      price: product.price,
    };
  });

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should update a product", async () => {
    const productRepository = new ProductRepository();
    const productUpdateUseCase = new UpdateProductUseCase(productRepository);

    await productRepository.create(product);

    input.name = "Cheaper Laptop";
    input.price = 1000;

    const output = await productUpdateUseCase.execute(input);

    expect(output).toEqual(input);
  });

  it("should thrown an error when name is missing", async () => {
    const productRepository = new ProductRepository();
    const productCreateUseCase = new UpdateProductUseCase(productRepository);

    await productRepository.create(product);

    input.name = "";

    await expect(productCreateUseCase.execute(input)).rejects.toThrow(
      "product: Name is required"
    );
  });

  it("should thrown an error when price is less than zero", async () => {
    const productRepository = new ProductRepository();
    const productCreateUseCase = new UpdateProductUseCase(productRepository);

    await productRepository.create(product);

    input.price = -1;

    await expect(productCreateUseCase.execute(input)).rejects.toThrow(
      "product: Price must be greater than zero"
    );
  });

  it("should thrown an all errors when name is missing and price is less than zero", async () => {
    const productRepository = new ProductRepository();
    const productCreateUseCase = new UpdateProductUseCase(productRepository);

    await productRepository.create(product);

    input.name = "";
    input.price = -1;

    await expect(productCreateUseCase.execute(input)).rejects.toThrow(
      "product: Name is required,product: Price must be greater than zero"
    );
  });
});
