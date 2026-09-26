import Course from '../models/Course.js';
import { buildCrudController } from './crudFactory.js';

const base = buildCrudController(Course, {
  searchFields: ['courseName', 'platform', 'instructor'],
  filterFields: ['status', 'platform'],
  entityName: 'Course',
});

export const { list: listCourses, getOne: getCourse, create: createCourse, update: updateCourse, remove: deleteCourse } = base;
