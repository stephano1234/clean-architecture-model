import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for product", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {
    const name = "Laptop";
    const price = 5000;

    const response = await request(app)
      .post("/product")
      .send({
        name,
        price,
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(name);
    expect(response.body.price).toBe(price);
  });

  it("should not create a product", async () => {
    const price = -1;

    const response = await request(app).post("/product").send({
      price,
    });
    expect(response.status).toBe(500);
  });

  it("should list all product", async () => {
    const name1 = "Laptop";
    const price1 = 5000;
    const name2 = "Mouse Pad";
    const price2 = 50;

    const response1 = await request(app)
      .post("/product")
      .send({
        name: name1,
        price: price1,
      });
    expect(response1.status).toBe(200);
    const response2 = await request(app)
      .post("/product")
      .send({
        name: name2,
        price: price2,
      });
    expect(response2.status).toBe(200);

    const listResponse = await request(app).get("/product").send();

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.products.length).toBe(2);
    const product1 = listResponse.body.products[0];
    expect(product1.name).toBe(name1);
    expect(product1.price).toBe(price1);
    const product2 = listResponse.body.products[1];
    expect(product2.name).toBe(name2);
    expect(product2.price).toBe(price2);

    const listResponseXML = await request(app)
      .get("/product")
      .set("Accept", "application/xml")
      .send();

    expect(listResponseXML.status).toBe(200);
    expect(listResponseXML.text).toContain(`<?xml version="1.0" encoding="UTF-8"?>`);
    expect(listResponseXML.text).toContain(`<products>`);
    expect(listResponseXML.text).toContain(`</products>`);
    expect(listResponseXML.text).toContain(`<product>`);
    expect(listResponseXML.text).toContain(`</product>`);
    expect(listResponseXML.text).toContain(`<name>${name1}</name>`);
    expect(listResponseXML.text).toContain(`<price>${price1}</price>`);
    expect(listResponseXML.text).toContain(`<name>${name2}</name>`);
    expect(listResponseXML.text).toContain(`<price>${price2}</price>`);
  });
});
