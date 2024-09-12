import { Request, Response } from "express";

export const getHome = (req: Request, res: Response) => {
  res.render("pages/home");
};

export const getProducts = (req: Request, res: Response) => {
  res.render("pages/products");
};

export const getProduct = (req: Request, res: Response) => {
  var id = req.params["id"];
  res.render("pages/product", { id });
};

export const getSellers = (req: Request, res: Response) => {
  res.render("pages/sellers");
};

export const getSeller = (req: Request, res: Response) => {
  var id = req.params["id"];
  res.render("pages/seller", { id });
};
