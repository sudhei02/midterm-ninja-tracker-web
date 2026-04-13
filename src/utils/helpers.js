import { COURSE_GUIDANCE } from "../data/constants";

export const getCourseGuidance = (course) =>
  COURSE_GUIDANCE[course] || COURSE_GUIDANCE.MATH103;
