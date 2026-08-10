import { Router } from 'express';
import { TechnologyController } from '../controllers/technology.controller';
import { validate } from '../middleware/validate.middleware';
import { createTechnologySchema, updateTechnologySchema } from '../validators/technology.validator';

const router = Router();

// Public routes
router.get('/', TechnologyController.getAll);
router.get('/:slug', TechnologyController.getBySlug);
router.get('/domain/:domainId', TechnologyController.getByDomain);

export const technologyAdminRouter = Router();
technologyAdminRouter.get('/', TechnologyController.adminGetAll);
technologyAdminRouter.post('/', validate(createTechnologySchema), TechnologyController.create);
technologyAdminRouter.patch('/:id', validate(updateTechnologySchema), TechnologyController.update);
technologyAdminRouter.delete('/:id', TechnologyController.delete);
technologyAdminRouter.patch('/reorder', TechnologyController.reorder);

export default router;
