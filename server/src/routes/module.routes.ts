import { Router } from 'express';
import { ModuleController } from '../controllers/module.controller';
import { validate } from '../middleware/validate.middleware';
import { createModuleSchema, updateModuleSchema } from '../validators/module.validator';

const router = Router();

// Public routes
router.get('/course/:courseId', ModuleController.getByCourse);

export const moduleAdminRouter = Router();
moduleAdminRouter.post('/', validate(createModuleSchema), ModuleController.create);
moduleAdminRouter.patch('/:id', validate(updateModuleSchema), ModuleController.update);
moduleAdminRouter.delete('/:id', ModuleController.delete);
moduleAdminRouter.patch('/reorder', ModuleController.reorder);

export default router;
