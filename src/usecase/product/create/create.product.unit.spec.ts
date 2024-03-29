import RepositoryInterface from "../../../domain/@shared/repository/repository-interface";
import { InputCreateProductDto } from "./create.product.dto";
import CreateProductUseCase from "./create.product.usecase";

describe("Unit test create product use case", () => {
  let input: InputCreateProductDto;
  let mockRepository: Record<keyof RepositoryInterface<any>, jest.Mock<any, any>>;

  beforeEach(() => {
    input = {
      name: "Laptop",
      price: 5000,
    };
    mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
    };
  });

  it("should create a product", async () => {
    const productCreateUseCase = new CreateProductUseCase(mockRepository);

    const output = await productCreateUseCase.execute(input);

    expect(output).toEqual({
      id: expect.any(String),
      name: input.name,
      price: input.price,
    });
  });

  it("should thrown an error when name is missing", async () => {
    const productCreateUseCase = new CreateProductUseCase(mockRepository);

    input.name = "";

    await expect(productCreateUseCase.execute(input)).rejects.toThrow(
      "product: Name is required"
    );
  });

  it("should thrown an error when price is less than zero", async () => {
    const productCreateUseCase = new CreateProductUseCase(mockRepository);

    input.price = -1;

    await expect(productCreateUseCase.execute(input)).rejects.toThrow(
      "product: Price must be greater than zero"
    );
  });
});
