import Experience from '../models/Experience.js';
import { buildCrudController } from './crudFactory.js';

const base = buildCrudController(Experience, {
  searchFields: ['company', 'position', 'description'],
  filterFields: ['employmentType'],
  entityName: 'Experience',
});

export const { list: listExperience, getOne: getExperience, create: createExperience, update: updateExperience, remove: deleteExperience } = base;
