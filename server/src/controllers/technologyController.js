import Technology from '../models/Technology.js';
import { buildCrudController } from './crudFactory.js';

const base = buildCrudController(Technology, {
  searchFields: ['name', 'notes'],
  filterFields: ['category', 'proficiency'],
  entityName: 'Technology',
});

export const { list: listTechnologies, getOne: getTechnology, create: createTechnology, update: updateTechnology, remove: deleteTechnology } = base;
