import CourseService from "../../../services/course.service";
import UserService from "../../../services/user.service";
import { Request } from "express";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../../data-source";
import { Course } from "../../../entities/Course.entity";
import { User } from "../../../entities/User.entity";

describe("Joining a Course", () => {
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

  test("Service function Join Course should create an admin user, get its id to create a course, and make the user join the course", async () => {
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
    user.isAdm = true;

    const mockRequest = { validated: user } as Request;

    const newUser = await UserService.create(mockRequest);

    const userId = newUser.id;

    const courseName = "Curso 1";
    const duration = "1 semana";

    const course = new Course();
    course.courseName = courseName;
    course.duration = duration;

    mockRequest["validated"] = course as Course;
    mockRequest["decoded"] = userId;

    const newCourse = await CourseService.createCourse(mockRequest);

    const courseId = newCourse.id;

    mockRequest["params"] = courseId;

    await CourseService.joinCourse(mockRequest);

    const courses = await CourseService.readAllCourses(mockRequest);

    const studentCourseModel = { email, firstName, lastName, id: userId };

    const courseModel = {
      courseName,
      duration,
      id: courseId,
      students: [studentCourseModel],
    };

    expect(courses).toEqual([courseModel]);
  });
});
