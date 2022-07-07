import UserService from "../../../services/user.service";
import { Request } from "express";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../../data-source";
import { User } from "../../../entities/User.entity";

describe("Getting one User", () => {
  let connection: DataSource;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });
  });

  afterAll(async () => {
    await connection.destroy();
  });

  test("Service function getById User should create an user and get it alone on the database", async () => {
    const firstName = "kaueh";
    const lastName = "prats";
    const email = "kaueh1234@gmail.com";
    const password = "1234";
    const createdAt = new Date();
    const updatedAt = new Date();

    const user = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.password = password;
    user.createdAt = createdAt;
    user.updatedAt = updatedAt;
    user.isAdm = false;

    const mockRequest = { validated: user } as Request;

    const newUser = await UserService.create(mockRequest);

    mockRequest["user"] = newUser as User;

    const userInfo = await UserService.getById(mockRequest);

    expect(userInfo).toEqual(expect.objectContaining(newUser));
  });
});
