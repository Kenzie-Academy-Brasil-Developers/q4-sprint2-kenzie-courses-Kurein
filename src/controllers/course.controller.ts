import { Request, Response } from "express";
import { courseService } from "../services";

class CourseController {
  createCourse = async (req: Request, res: Response) => {
    const course = await courseService.createCourse(req);
    return res.status(201).json(course);
  };

  readAll = async (req: Request, res: Response) => {
    const courses = await courseService.readAllCourses(req);
    return res.status(200).json(courses);
  };

  updateCourse = async (req: Request, res: Response) => {
    const course = await courseService.updateCourse(req);
    return res.status(200).json(course);
  };

  joinCourse = async (req: Request, res: Response) => {
    const course = await courseService.joinCourse(req);
    return res.status(course.status).json(course.message);
  };
}

export default new CourseController();
