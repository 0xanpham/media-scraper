import { AppDataSource } from "../config/db";
import { Customer } from "../entities/customer";
import { HttpException } from "../exceptions/exception";
import { comparePassword, createToken, hashPassword } from "../helper/auth";
import logger from "../helper/logger";

async function signUp(username: string, password: string) {
  const customer = new Customer();
  customer.username = username;
  customer.password = await hashPassword(password);
  const newCustomer = await AppDataSource.manager.save(customer);
  logger.info(`User ${username} signed up`);
  return createToken(newCustomer.id, newCustomer.username);
}

async function signIn(username: string, password: string) {
  const customer = await Customer.findOneBy({ username });
  if (!customer) {
    throw new HttpException(400, "Customer does not exist");
  }
  const valid = await comparePassword(password, customer.password);
  if (!valid) {
    throw new HttpException(400, "Wrong password");
  }
  logger.info(`User ${username} signed in`);
  return createToken(customer.id, customer.username);
}

export { signUp, signIn };
