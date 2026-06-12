import mongoose, { Document, Model, Schema } from 'mongoose';

// Types for embedded documents
export interface IFile {
  originalName: string;
  storedName: string;
  mimeType: string;
  size: number;
  url: string;
  storageType: 'local' | 's3';
}

export interface IExtractedQuestion {
  index: number;
  text: string;
  page: number;
}

export interface IGeneratedAnswer {
  questionIndex: number;
  answer: string;
  tokensUsed: number;
}

export interface INotebookPage {
  pageNumber: number;
  imageUrl: string;
}

// Main Interface
export interface IAssignment extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  files: IFile[];
  status: 'uploading' | 'uploaded' | 'ocr_processing' | 'ocr_complete' | 'ai_processing' | 'ai_complete' | 'rendering' | 'completed' | 'failed';
  progress: number; // 0-100
  currentStep: string;
  extractedQuestions: IExtractedQuestion[];
  generatedAnswers: IGeneratedAnswer[];
  notebookPages: INotebookPage[];
  finalPdfUrl?: string;
  handwritingMode: 'realistic' | 'personal';
  handwritingProfileId?: mongoose.Types.ObjectId;
  creditsUsed: number;
  error?: {
    code: string;
    message: string;
    step: string;
  };
  metadata: {
    questionCount: number;
    pageCount: number;
    totalTokensUsed: number;
    processingTimeMs: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const fileSchema = new Schema<IFile>({
  originalName: { type: String, required: true },
  storedName: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  url: { type: String, required: true },
  storageType: { type: String, enum: ['local', 's3'], required: true },
});

const extractedQuestionSchema = new Schema<IExtractedQuestion>({
  index: { type: Number, required: true },
  text: { type: String, required: true },
  page: { type: Number, required: true },
});

const generatedAnswerSchema = new Schema<IGeneratedAnswer>({
  questionIndex: { type: Number, required: true },
  answer: { type: String, required: true },
  tokensUsed: { type: Number, default: 0 },
});

const notebookPageSchema = new Schema<INotebookPage>({
  pageNumber: { type: Number, required: true },
  imageUrl: { type: String, required: true },
});

const assignmentSchema = new Schema<IAssignment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    files: [fileSchema],
    status: {
      type: String,
      enum: [
        'uploading',
        'uploaded',
        'ocr_processing',
        'ocr_complete',
        'ai_processing',
        'ai_complete',
        'rendering',
        'completed',
        'failed',
      ],
      default: 'uploading',
      index: true,
    },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    currentStep: { type: String, default: 'Initializing upload' },
    extractedQuestions: [extractedQuestionSchema],
    generatedAnswers: [generatedAnswerSchema],
    notebookPages: [notebookPageSchema],
    finalPdfUrl: { type: String },
    handwritingMode: { type: String, enum: ['realistic', 'personal'], default: 'realistic' },
    handwritingProfileId: { type: Schema.Types.ObjectId, ref: 'HandwritingProfile' }, // Assuming this model exists or will exist
    creditsUsed: { type: Number, default: 0 },
    error: {
      code: String,
      message: String,
      step: String,
    },
    metadata: {
      questionCount: { type: Number, default: 0 },
      pageCount: { type: Number, default: 0 },
      totalTokensUsed: { type: Number, default: 0 },
      processingTimeMs: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
assignmentSchema.index({ createdAt: -1 });

export const Assignment = mongoose.models.Assignment || mongoose.model<IAssignment>('Assignment', assignmentSchema);
