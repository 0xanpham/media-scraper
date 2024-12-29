import { array, object, string } from "yup";

const importSchema = object({
  urls: array(string().url())
    .min(1, "array must have at least 1 url")
    .required(),
});

export { importSchema };
