import RepositoryInterface from "../../../domain/@shared/repository/repository-interface";
import Product from "../../../domain/product/entity/product";
import ProductFactory from "../../../domain/product/factory/product.factory";
import { InputFindProductDto } from "./find.product.dto";
import FindProductUseCase from "./find.product.usecase";

describe("Unit Test find product use case", () => {
  let input: InputFindProductDto;
  let product: Product;
  let mockRepository: Record<keyof RepositoryInterface<any>, jest.Mock<any, any>>;

  beforeEach(() => {
    product = ProductFactory.create(
      "Laptop",
      5000,
    );
    input = { id: product.id };
    mockRepository = {
      find: jest.fn().mockReturnValue(Promise.resolve(product)),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };
  });

  it("should find a product", async () => {
    const usecase = new FindProductUseCase(mockRepository);

    const result = await usecase.execute(input);

    expect(result).toEqual({
      id: input.id,
      name: product.name,
      price: product.price,
    });
  });

  it("should not find a product", async () => {
    mockRepository.find.mockImplementation(() => {
      throw new Error();
    });
    const usecase = new FindProductUseCase(mockRepository);

    await expect(usecase.execute(input)).rejects.toThrow();
  });
});
