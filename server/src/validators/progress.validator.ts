import { z } from 'zod';
import mongoose from 'mongoose';

const objectIdString = z.string().refine(
  (val) => mongoose.Types.ObjectId.isValid(val),
  { message: 'Invalid ID format' }
);

export const completeLessonSchema = z.object({
  lessonId: objectIdString,
});

export type CompleteLessonInput = z.infer<typeof completeLessonSchema>;
