import { object, string } from "yup";

const customerSchema = object({
  username: string()
    .min(6)
    .max(10)
    .required()
    .matches(
      /^[a-zA-Z0-9_]*$/,
      "username must contain alphanumeric characters"
    ),
  password: string()
    .min(6)
    .max(10)
    .required()
    .matches(
      /^[a-zA-Z0-9_]*$/,
      "password must contain alphanumeric characters"
    ),
});

export { customerSchema };
