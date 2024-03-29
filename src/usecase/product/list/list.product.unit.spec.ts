import RepositoryInterface from "../../../domain/@shared/repository/repository-interface";
import Product from "../../../domain/product/entity/product";
import ProductFactory from "../../../domain/product/factory/product.factory";
import ListProductUseCase from "./list.product.usecase";

describe("Unit test for listing product use case", () => {
  let product1: Product;
  let product2: Product;
  let mockRepository: Record<keyof RepositoryInterface<any>, jest.Mock<any, any>>;

  beforeEach(() => {
    product1 = ProductFactory.create(
      "Laptop",
      5000,
    );
    product2 = ProductFactory.create(
      "Mouse Pad",
      50,
    );
    mockRepository = {
      create: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn().mockReturnValue(Promise.resolve([product1, product2])),
    };
  });

  it("should list a product", async () => {
    const useCase = new ListProductUseCase(mockRepository);

    const output = await useCase.execute({});

    expect(output.products.length).toBe(2);
    expect(output.products[0].id).toBe(product1.id);
    expect(output.products[0].name).toBe(product1.name);
    expect(output.products[0].price).toBe(product1.price);
    expect(output.products[1].id).toBe(product2.id);
    expect(output.products[1].name).toBe(product2.name);
    expect(output.products[1].price).toBe(product2.price);
  });
});
