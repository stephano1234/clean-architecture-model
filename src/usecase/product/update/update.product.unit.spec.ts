import RepositoryInterface from "../../../domain/@shared/repository/repository-interface";
import Product from "../../../domain/product/entity/product";
import ProductFactory from "../../../domain/product/factory/product.factory";
import { InputUpdateProductDto } from "./update.product.dto";
import UpdateProductUseCase from "./update.product.usecase";

describe("Unit test for product update use case", () => {
  let product: Product;
  let input: InputUpdateProductDto;
  let mockRepository: Record<keyof RepositoryInterface<any>, jest.Mock<any, any>>;

  beforeEach(() => {
    product = ProductFactory.create(
      "Laptop",
      5000,
    );
    input = {
      id: product.id,
      name: product.name,
      price: product.price,
    };
    mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      find: jest.fn().mockReturnValue(Promise.resolve(product)),
      update: jest.fn(),
    };
  });

  it("should update a product", async () => {
    const productUpdateUseCase = new UpdateProductUseCase(mockRepository);

    input.name = "Cheaper Laptop";
    input.price = 1000;

    const output = await productUpdateUseCase.execute(input);

    expect(output).toEqual(input);
  });

  it("should thrown an error when name is missing", async () => {
    const productCreateUseCase = new UpdateProductUseCase(mockRepository);

    input.name = "";

    await expect(productCreateUseCase.execute(input)).rejects.toThrow(
      "product: Name is required"
    );
  });

  it("should thrown an error when price is less than zero", async () => {
    const productCreateUseCase = new UpdateProductUseCase(mockRepository);

    input.price = -1;

    await expect(productCreateUseCase.execute(input)).rejects.toThrow(
      "product: Price must be greater than zero"
    );
  });

  it("should thrown an all errors when name is missing and price is less than zero", async () => {
    const productCreateUseCase = new UpdateProductUseCase(mockRepository);

    input.name = "";
    input.price = -1;

    await expect(productCreateUseCase.execute(input)).rejects.toThrow(
      "product: Name is required,product: Price must be greater than zero"
    );
  });
});
