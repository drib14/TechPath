import { Exercise } from '../models/Exercise';
import { Lesson } from '../models/Lesson';
import { ApiError } from '../utils/ApiError';
import {
  CreateExerciseInput,
  UpdateExerciseInput,
  SubmitExerciseInput,
} from '../validators/exercise.validator';

export class ExerciseService {
  /**
   * Get all exercises for a lesson (public — hides correct answers).
   */
  static async getByLesson(lessonId: string) {
    const exercises = await Exercise.find({ lessonId })
      .sort({ order: 1 })
      .lean();

    // Sanitize: strip isCorrect and correctAnswer for public consumption
    return exercises.map((ex) => ({
      _id: ex._id,
      lessonId: ex.lessonId,
      type: ex.type,
      question: ex.question,
      options: ex.options.map((opt) => ({ text: opt.text })),
      explanation: '', // Hidden until submitted
      order: ex.order,
    }));
  }

  /**
   * Get exercises for a lesson (admin — full data including answers).
   */
  static async getByLessonAdmin(lessonId: string) {
    return Exercise.find({ lessonId }).sort({ order: 1 }).lean();
  }

  /**
   * Get a single exercise by ID (admin).
   */
  static async getById(id: string) {
    const exercise = await Exercise.findById(id);
    if (!exercise) {
      throw ApiError.notFound('Exercise not found', 'EXERCISE_NOT_FOUND');
    }
    return exercise;
  }

  /**
   * Create a new exercise.
   */
  static async create(data: CreateExerciseInput) {
    const lesson = await Lesson.findById(data.lessonId);
    if (!lesson) {
      throw ApiError.notFound('Parent lesson not found', 'LESSON_NOT_FOUND');
    }

    return Exercise.create(data);
  }

  /**
   * Update an exercise.
   */
  static async update(id: string, data: UpdateExerciseInput) {
    const exercise = await Exercise.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!exercise) {
      throw ApiError.notFound('Exercise not found', 'EXERCISE_NOT_FOUND');
    }

    return exercise;
  }

  /**
   * Delete an exercise.
   */
  static async delete(id: string) {
    const exercise = await Exercise.findByIdAndDelete(id);
    if (!exercise) {
      throw ApiError.notFound('Exercise not found', 'EXERCISE_NOT_FOUND');
    }
    return exercise;
  }

  /**
   * Check a learner's answer server-side.
   * Returns whether the answer is correct, the correct answer, and explanation.
   * Never trusts the client for scoring.
   */
  static async checkAnswer(id: string, input: SubmitExerciseInput) {
    const exercise = await Exercise.findById(id);
    if (!exercise) {
      throw ApiError.notFound('Exercise not found', 'EXERCISE_NOT_FOUND');
    }

    let isCorrect = false;

    if (
      exercise.type === 'multiple-choice' ||
      exercise.type === 'true-false'
    ) {
      // Option-based: compare selected index to the correct option
      if (input.selectedOptionIndex !== undefined) {
        const correctIndex = exercise.options.findIndex((opt) => opt.isCorrect);
        isCorrect = input.selectedOptionIndex === correctIndex;
      }
    } else if (exercise.type === 'text-answer') {
      // Text-based: case-insensitive comparison
      if (input.textAnswer !== undefined) {
        isCorrect =
          input.textAnswer.trim().toLowerCase() ===
          exercise.correctAnswer.trim().toLowerCase();
      }
    } else {
      // code, configuration, scenario — compare text answer
      if (input.textAnswer !== undefined) {
        isCorrect =
          input.textAnswer.trim().toLowerCase() ===
          exercise.correctAnswer.trim().toLowerCase();
      }
    }

    const correctIndex = exercise.options.findIndex((opt) => opt.isCorrect);

    return {
      isCorrect,
      correctOptionIndex: correctIndex >= 0 ? correctIndex : undefined,
      correctAnswer: exercise.correctAnswer || undefined,
      explanation: exercise.explanation,
    };
  }
}
