import CourseService from "../../../services/course.service";
import { Request } from "express";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../../data-source";
import { Course } from "../../../entities/Course.entity";

describe("Creating a Course", () => {
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

  test("Service function Create Course should create a course and return its values", async () => {
    const courseName = "Curso 1";
    const duration = "1 semana";

    const course = new Course();
    course.courseName = courseName;
    course.duration = duration;

    const mockRequest = { validated: course } as Request;

    const newCourse = await CourseService.createCourse(mockRequest);

    const { id } = newCourse;

    expect(newCourse).toEqual(
      expect.objectContaining({
        id: id,
        courseName,
        duration,
      })
    );
  });
});
