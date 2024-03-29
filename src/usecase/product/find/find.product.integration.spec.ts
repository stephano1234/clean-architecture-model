import { Sequelize } from "sequelize-typescript";
import Product from "../../../domain/product/entity/product";
import { InputFindProductDto } from "./find.product.dto";
import FindProductUseCase from "./find.product.usecase";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ProductFactory from "../../../domain/product/factory/product.factory";

describe("Integration Test find product use case", () => {
  let input: InputFindProductDto;
  let product: Product;
  let sequelize: Sequelize;

  beforeEach(() => {
    product = ProductFactory.create(
      "Laptop",
      5000,
    );
    input = { id: product.id };
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

  it("should find a product", async () => {
    const productRepository = new ProductRepository();
    const usecase = new FindProductUseCase(productRepository);

    await productRepository.create(product);

    const result = await usecase.execute(input);

    expect(result).toEqual({
      id: input.id,
      name: product.name,
      price: product.price,
    });
  });

  it("should not find a product", async () => {
    const productRepository = new ProductRepository();
    const usecase = new FindProductUseCase(productRepository);
    const notFoundId = "0";

    await productRepository.create(product);

    await expect(usecase.execute({ id: notFoundId })).rejects.toThrow();
  });
});
