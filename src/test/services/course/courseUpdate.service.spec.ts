import CourseService from "../../../services/course.service";
import { Request } from "express";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../../data-source";
import { Course } from "../../../entities/Course.entity";

describe("Updating a Course", () => {
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

  test("Service function Create Course should create a course, update it, and return its values", async () => {
    const courseName = "Curso 1";
    const duration = "1 semana";

    const course = new Course();
    course.courseName = courseName;
    course.duration = duration;
    const mockRequest = { validated: course } as Request;

    const newCourse = await CourseService.createCourse(mockRequest);

    mockRequest["validated"] = {
      courseName: "O Curso 1",
      duration: "1 ano",
    } as Course;
    mockRequest["params"] = { id: newCourse.id };

    const updatedCourse = await CourseService.updateCourse(mockRequest);

    const updatedCourseModel = {
      courseName: "O Curso 1",
      duration: "1 ano",
      id: newCourse.id,
    };

    expect(updatedCourse).toEqual(updatedCourseModel);
  });
});
