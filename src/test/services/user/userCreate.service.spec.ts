import UserService from "../../../services/user.service";
import { Request } from "express";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../../data-source";
import { User } from "../../../entities/User.entity";

describe("Creating an User", () => {
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

  test("Should insert the information of the new user in the database", async () => {
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

    const { id } = newUser;

    expect(newUser).toEqual(
      expect.objectContaining({
        id: id,
        firstName,
        lastName,
        email,
        isAdm: false,
        createdAt,
        updatedAt,
        courses: [],
      })
    );
  });
});
