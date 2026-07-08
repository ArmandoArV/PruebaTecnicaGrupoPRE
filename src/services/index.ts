import { exampleRepository } from "../repositories";
import { ExampleModel } from "../models";

export const exampleService = {
  async list(): Promise<ExampleModel[]> {
    return exampleRepository.findAll();
  },
};
