import AiExperiment from '../models/AiExperiment.js';
import { buildCrudController } from './crudFactory.js';

const base = buildCrudController(AiExperiment, {
  searchFields: ['name', 'description', 'modelUsed'],
  filterFields: [],
  entityName: 'AI Experiment',
});

export const {
  list: listAiExperiments,
  getOne: getAiExperiment,
  create: createAiExperiment,
  update: updateAiExperiment,
  remove: deleteAiExperiment,
} = base;
