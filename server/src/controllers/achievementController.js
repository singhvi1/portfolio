import Achievement from '../models/Achievement.js';
import { buildCrudController } from './crudFactory.js';

const base = buildCrudController(Achievement, {
  searchFields: ['title', 'description', 'organization'],
  filterFields: ['category'],
  entityName: 'Achievement',
});

export const { list: listAchievements, getOne: getAchievement, create: createAchievement, update: updateAchievement, remove: deleteAchievement } = base;
