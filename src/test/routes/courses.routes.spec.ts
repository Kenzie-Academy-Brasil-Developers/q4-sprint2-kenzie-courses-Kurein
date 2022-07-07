import request from "supertest";
import app from "../../app";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../data-source";

describe("Testing the course routes", () => {
  let connection: DataSource;

  let courseId = "";

  let token = "";

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });

    const email = "kaueh1234@gmail.com";
    const password = "1234";
    const firstName = "Kaueh";
    const lastName = "Prats";
    const isAdm = true;

    const userData = { email, password, firstName, lastName, isAdm };

    await request(app).post("/users").send(userData);

    const { body } = await request(app)
      .post("/login")
      .send({ email, password });

    token = body.token;
  });

  afterAll(async () => {
    await connection.destroy();
  });

  test("Should be able to create a new course", async () => {
    const courseName = "Curso 1";
    const duration = "1 semana";

    const courseData = { courseName, duration };

    const { status, body } = await request(app)
      .post("/courses")
      .set("Authorization", `Bearer ${token}`)
      .send(courseData);

    courseId = body.id;

    expect(status).toBe(201);
    expect(body).toHaveProperty("id");
    expect(body).toHaveProperty("courseName", courseName);
    expect(body).toHaveProperty("duration", duration);
  });

  test("Should be able to get all courses", async () => {
    const { status, body } = await request(app)
      .get("/courses")
      .set("Authorization", `Bearer ${token}`);

    expect(status).toBe(200);
    expect(body).toHaveProperty("map");
    expect(body[0]).toHaveProperty("id", courseId);
    expect(body[0]).toHaveProperty("courseName");
    expect(body[0]).toHaveProperty("duration");
    expect(body[0]).toHaveProperty("students");
    expect(body[0].students).toHaveProperty("map");
  });

  test("Should be able to update a course", async () => {
    const courseName = "O Curso 1";
    const duration = "1 ano";

    const courseUpdateInfo = { courseName, duration };

    const { status, body } = await request(app)
      .patch(`/courses/${courseId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(courseUpdateInfo);

    expect(status).toBe(200);
    expect(body).toHaveProperty("id");
    expect(body).toHaveProperty("courseName", courseName);
    expect(body).toHaveProperty("duration", duration);
  });
});
