import { Assessment } from '../models/Assessment';
import { Lesson } from '../models/Lesson';
import { ApiError } from '../utils/ApiError';
import {
  CreateAssessmentInput,
  UpdateAssessmentInput,
  SubmitAssessmentInput,
} from '../validators/assessment.validator';

export class AssessmentService {
  static async getAll() {
    return Assessment.find()
      .populate('lessonId', 'title slug moduleId')
      .sort({ createdAt: -1 })
      .lean();
  }

  static async getByLesson(lessonId: string) {
    const assessment = await Assessment.findOne({ lessonId }).lean();
    return assessment;
  }

  static async getById(id: string) {
    const assessment = await Assessment.findById(id).populate('lessonId', 'title slug');
    if (!assessment) {
      throw ApiError.notFound('Assessment not found', 'ASSESSMENT_NOT_FOUND');
    }
    return assessment;
  }

  static async create(data: CreateAssessmentInput) {
    const lesson = await Lesson.findById(data.lessonId);
    if (!lesson) {
      throw ApiError.notFound('Parent lesson not found', 'LESSON_NOT_FOUND');
    }

    const existing = await Assessment.findOne({ lessonId: data.lessonId });
    if (existing) {
      throw ApiError.conflict(
        'An assessment already exists for this lesson. Update it instead.',
        'ASSESSMENT_EXISTS'
      );
    }

    return Assessment.create(data);
  }

  static async update(id: string, data: UpdateAssessmentInput) {
    const assessment = await Assessment.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!assessment) {
      throw ApiError.notFound('Assessment not found', 'ASSESSMENT_NOT_FOUND');
    }

    return assessment;
  }

  static async delete(id: string) {
    const assessment = await Assessment.findByIdAndDelete(id);
    if (!assessment) {
      throw ApiError.notFound('Assessment not found', 'ASSESSMENT_NOT_FOUND');
    }
    return assessment;
  }

  static async submit(id: string, input: SubmitAssessmentInput) {
    const assessment = await Assessment.findById(id);
    if (!assessment) {
      throw ApiError.notFound('Assessment not found', 'ASSESSMENT_NOT_FOUND');
    }

    const totalQuestions = assessment.questions.length;
    if (totalQuestions === 0) {
      return { score: 100, passed: true, details: [] };
    }

    let correctCount = 0;
    const details = assessment.questions.map((q, idx) => {
      const userAnswer = input.answers.find((a) => a.questionIndex === idx);
      const selectedIndex = userAnswer?.selectedOptionIndex ?? -1;
      const correctIndex = q.options.findIndex((opt) => opt.isCorrect);
      const isCorrect = selectedIndex !== -1 && selectedIndex === correctIndex;

      if (isCorrect) {
        correctCount += 1;
      }

      return {
        questionIndex: idx,
        question: q.question,
        selectedIndex,
        correctIndex,
        isCorrect,
        explanation: q.explanation,
      };
    });

    const score = Math.round((correctCount / totalQuestions) * 100);
    const passed = score >= assessment.passingScore;

    return {
      score,
      passed,
      correctCount,
      totalQuestions,
      passingScore: assessment.passingScore,
      details,
    };
  }
}
