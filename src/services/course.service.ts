import { Request } from "express";
import { courseRepository, userRepository } from "../repositories";
import { AssertsShape } from "yup/lib/object";
import { Course, User } from "../entities";
import {
  serializedAdminCoursesSchema,
  serializedCourseSchema,
  serializedStudentsCoursesSchema,
} from "../schemas";
import { AppDataSource } from "../data-source";
import transport from "../config/mailer.config";

class CourseService {
  createCourse = async ({ validated }: Request): Promise<AssertsShape<any>> => {
    const course = await courseRepository.save(validated as Course);
    return await serializedCourseSchema.validate(course, {
      stripUnknown: true,
    });
  };

  readAllCourses = async ({ decoded }): Promise<AssertsShape<any>> => {
    let newList = [];
    const courses = await courseRepository.listAll();
    const loggedUser = await userRepository.retrieve({ id: decoded.id });
    if (loggedUser.isAdm) {
      for (const element of courses) {
        newList.push({
          id: element.id,
          courseName: element.courseName,
          duration: element.duration,
          students: await element.students,
        });
      }
      return await serializedAdminCoursesSchema.validate(newList, {
        stripUnknown: true,
      });
    }
    return await serializedStudentsCoursesSchema.validate(courses, {
      stripUnknown: true,
    });
  };

  updateCourse = async ({ validated, params }): Promise<AssertsShape<any>> => {
    const course = await courseRepository.update(params.id, {
      ...(validated as Course),
    });
    const updatedCourse = await courseRepository.retrieve({ id: params.id });
    return await serializedCourseSchema.validate(updatedCourse, {
      stripUnknown: true,
    });
  };

  joinCourse = async (req: Request) => {
    const course = await courseRepository.retrieve({ id: req.params.id });
    const user = await userRepository.retrieve({ id: req.decoded.id });

    course.students = [...course.students, user];

    const mailOptions = {
      from: "kaueh1234@gmail.com",
      to: user.email,
      subject: `Kauehnzie Course Management`,
      text: `Thank you for joining the course ${course.courseName}, this course will last for ${course.duration}, if at any given moment you want to leave, please let the suport team know to proceed with the request`,
    };

    transport.sendMail(mailOptions, (err) => {
      if (err) {
        console.log(err);
      }
    });

    await courseRepository.save(course);

    return {
      status: 200,
      message: { message: "Email de inscrição enviado com sucesso." },
    };
  };
}

export default new CourseService();
