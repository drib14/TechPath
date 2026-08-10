import { Router } from 'express';
import { DomainController } from '../controllers/domain.controller';
import { validate } from '../middleware/validate.middleware';
import { createDomainSchema, updateDomainSchema } from '../validators/domain.validator';

const router = Router();

// Public routes
router.get('/', DomainController.getAll);
router.get('/:slug', DomainController.getBySlug);

export const domainAdminRouter = Router();
domainAdminRouter.get('/', DomainController.adminGetAll);
domainAdminRouter.post('/', validate(createDomainSchema), DomainController.create);
domainAdminRouter.patch('/:id', validate(updateDomainSchema), DomainController.update);
domainAdminRouter.delete('/:id', DomainController.delete);
domainAdminRouter.patch('/reorder', DomainController.reorder);

export default router;
