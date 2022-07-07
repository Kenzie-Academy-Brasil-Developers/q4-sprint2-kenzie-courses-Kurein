import request from "supertest";
import app from "../../app";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../data-source";

describe("Testing the user routes", () => {
  let connection: DataSource;

  let token = "";

  let userId = "";

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

  test("Should be able to create a new user", async () => {
    const email = "kaueh1234@gmail.com";
    const password = "1234";
    const firstName = "Kaueh";
    const lastName = "Prats";
    const isAdm = true;

    const userData = { email, password, firstName, lastName, isAdm };

    const { status, body } = await request(app).post("/users").send(userData);

    userId = body.id;

    expect(status).toBe(201);
    expect(body).toHaveProperty("updatedAt");
    expect(body).toHaveProperty("createdAt");
    expect(body).toHaveProperty("id");
    expect(body).toHaveProperty("isAdm", isAdm);
    expect(body).toHaveProperty("courses", []);
    expect(body).toHaveProperty("firstName", firstName);
    expect(body).toHaveProperty("lastName", lastName);
    expect(body).toHaveProperty("email", email);
  });

  test("Should be able to login", async () => {
    const email = "kaueh1234@gmail.com";
    const password = "1234";

    const loginData = { email, password };

    const { status, body } = await request(app).post("/login").send(loginData);

    token = body.token;

    expect(status).toBe(200);
    expect(body).toHaveProperty("token");
  });

  test("Should be able to get all users", async () => {
    const { status, body } = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${token}`);

    expect(status).toBe(200);
    expect(body).toHaveProperty("map");
    expect(body[0]).toHaveProperty("updatedAt");
    expect(body[0]).toHaveProperty("createdAt");
    expect(body[0]).toHaveProperty("id", userId);
    expect(body[0]).toHaveProperty("isAdm", true);
    expect(body[0]).toHaveProperty("firstName");
    expect(body[0]).toHaveProperty("lastName");
    expect(body[0]).toHaveProperty("email");
  });

  test("Should be able to get one user", async () => {
    const { status, body } = await request(app)
      .get(`/users/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(status).toBe(200);
    expect(body).toHaveProperty("updatedAt");
    expect(body).toHaveProperty("createdAt");
    expect(body).toHaveProperty("id", userId);
    expect(body).toHaveProperty("isAdm", true);
    expect(body).toHaveProperty("firstName");
    expect(body).toHaveProperty("lastName");
    expect(body).toHaveProperty("email");
  });

  test("Should be able to update one user", async () => {
    const updateInfo = { firstName: "Alberto", lastName: "Azevedo" };

    const { status, body } = await request(app)
      .patch(`/users/${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updateInfo);

    expect(status).toBe(200);
    expect(body).toHaveProperty("updatedAt");
    expect(body).toHaveProperty("createdAt");
    expect(body).toHaveProperty("id", userId);
    expect(body).toHaveProperty("isAdm", true);
    expect(body).toHaveProperty("firstName", "Alberto");
    expect(body).toHaveProperty("lastName", "Azevedo");
    expect(body).toHaveProperty("email");
  });
});
