import { Router } from "express";
import { v4 as uuid } from "uuid";

import { ensuredAuthenticated } from "./middleware";

const router = Router();

interface IProductsDTO {
  name: string;
  description: string;
  price: number;
  id?: string;
}

const products: IProductsDTO[] = [
  { name: "Mãe do Caio", description: "Mãe do caio", price: 0, id: "dsadef" },
];

router.get("/products/findByName", (request, response) => {
  const { name } = request.query;
  const product = products.filter((p) => p.name.includes(String(name)));
  return response.json(product);
});

router.get("/products/:id", (request, response) => {
  const { id } = request.params;
  const product = products.find((product) => product.id === id);
  return response.json(product);
});

router.post("/products", ensuredAuthenticated, (request, response) => {
  const { name, description, price } = request.body;

  const productAlreadyExists = products.find(
    (product) => product.name === name
  );

  if (productAlreadyExists) {
    return response.status(400).json({ message: "Product Already Exists" });
  }

  const product: IProductsDTO = {
    description,
    name,
    price,
    id: uuid(),
  };

  products.push(product);

  return response.json(products);
});

router.put("/products/:id", (request, response) => {
  const { id } = request.params;
  const { name, description, price } = request.body;

  const productIndex = products.findIndex((product) => product.id === id);

  if (productIndex === -1) {
    return response.status(400).json({ message: "Product doesn't exist'" });
  }

  const product: IProductsDTO = { name, description, price, id };

  products[productIndex] = product;

  return response.json(products);
});

router.delete("/products/:id", (request, response) => {
  const { id } = request.params;

  const productIndex = products.findIndex((product) => product.id === id);

  if (productIndex === -1) {
    return response.status(400).json({ message: "Product doesn't exist'" });
  }

  const removeItem = products.splice(productIndex, 1);

  return response.json(removeItem);
});

export { router };
