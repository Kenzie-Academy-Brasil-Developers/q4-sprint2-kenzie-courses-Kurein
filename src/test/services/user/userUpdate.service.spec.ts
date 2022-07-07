import UserService from "../../../services/user.service";
import { Request } from "express";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../../data-source";
import { User } from "../../../entities/User.entity";

describe("Updating an User", () => {
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

  test("Service function update User should create an user and update it on the database", async () => {
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
    mockRequest["validated"] = {
      firstName: "Roberta",
      lastName: "Oliveira",
      updatedAt: new Date(),
    } as User;

    const updatedUser = await UserService.update(mockRequest);

    const updatedUserModel = {
      firstName: "Roberta",
      lastName: "Oliveira",
      email,
      createdAt,
      updatedAt: mockRequest["validated"].updatedAt,
      id: newUser.id,
      isAdm: false,
      courses: [],
    };

    expect(updatedUser).toEqual(updatedUserModel);
  });
});
