import express from "express";
import { signIn, signUp } from "../services/customer";
import { dtoValidationMiddleware } from "../middlewares/dto";
import { customerSchema } from "../dto/customer";

const authRouter = express.Router();

authRouter.post(
  "/sign-up",
  dtoValidationMiddleware(customerSchema),
  async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const token = await signUp(username, password);
      res
        .status(201)
        .json({ token, message: `Create ${username} successfully` });
    } catch (error) {
      next(error);
    }
  }
);

authRouter.post(
  "/sign-in",
  dtoValidationMiddleware(customerSchema),
  async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const token = await signIn(username, password);
      res.status(200).json({ token, message: "Sign in successfully" });
    } catch (error) {
      next(error);
    }
  }
);

export default authRouter;
