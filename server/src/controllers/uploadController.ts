import { Request, Response } from 'express';
import { Assignment } from '../models/Assignment';
import { User } from '../models/User';
import { validateFileType } from '../utils/fileUtils';
import { storageService } from '../services/storageService';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { logger } from '../utils/logger';

/**
 * Mock function to represent an async queue for processing OCR
 */
const queueOcrProcessing = async (assignmentId: string) => {
  logger.info(`Queued OCR processing for assignment: ${assignmentId}`);
  // In a real app, this would push to a Redis/Bull queue.
  // We'll mock the progression here.
  setTimeout(async () => {
    try {
      const assignment = await Assignment.findById(assignmentId);
      if (!assignment) return;

      assignment.status = 'ocr_processing';
      assignment.currentStep = 'Extracting text from files...';
      assignment.progress = 20;
      await assignment.save();

      setTimeout(async () => {
        assignment.status = 'ai_processing';
        assignment.currentStep = 'Generating AI answers...';
        assignment.progress = 50;
        await assignment.save();

        setTimeout(async () => {
          assignment.status = 'rendering';
          assignment.currentStep = 'Rendering realistic handwriting...';
          assignment.progress = 80;
          await assignment.save();

          setTimeout(async () => {
            assignment.status = 'completed';
            assignment.currentStep = 'Done';
            assignment.progress = 100;
            assignment.metadata.pageCount = 3;
            assignment.metadata.questionCount = 5;
            await assignment.save();
          }, 3000);
        }, 3000);
      }, 3000);
    } catch (err) {
      logger.error(`Error in mock OCR processing: ${err}`);
    }
  }, 2000);
};

/**
 * Upload Assignment Files
 * POST /api/upload/assignment
 */
export const uploadAssignment = asyncHandler(async (req: Request, res: Response) => {
  const { title, handwritingMode, handwritingProfileId } = req.body;
  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    throw new ApiError(400, 'UPLOAD_001: No files provided');
  }

  // Double check user credits
  const user = await User.findById(req.user?.userId);
  if (!user || user.credits < 1) {
    throw new ApiError(403, 'UPLOAD_002: Insufficient credits');
  }

  // Validate files beyond multer (magic bytes check simulation)
  for (const file of files) {
    if (!validateFileType(file.mimetype, file.originalname)) {
      throw new ApiError(400, `UPLOAD_003: Invalid file type for ${file.originalname}`);
    }
  }

  const defaultTitle = title || files[0].originalname.split('.')[0] || 'Untitled Assignment';

  const assignmentFiles = files.map((f) => ({
    originalName: f.originalname,
    storedName: f.filename,
    mimeType: f.mimetype,
    size: f.size,
    url: `${process.env.API_URL || 'http://localhost:5000'}/uploads/${user._id}/assignments/${f.filename}`,
    storageType: process.env.STORAGE_TYPE === 's3' ? 's3' : 'local' as any,
  }));

  const assignment = new Assignment({
    userId: user._id,
    title: defaultTitle,
    files: assignmentFiles,
    status: 'uploaded',
    progress: 5,
    currentStep: 'Files uploaded, queued for processing',
    handwritingMode: handwritingMode || 'realistic',
    handwritingProfileId: handwritingProfileId || null,
  });

  await assignment.save();

  // Deduct credit
  user.credits -= 1;
  await user.save();

  // Trigger async processing
  queueOcrProcessing(assignment._id.toString());

  res.status(202).json({
    message: 'Files uploaded. Processing started.',
    assignmentId: assignment._id,
  });
});

/**
 * Retry Failed Assignment
 * POST /api/upload/assignment/:id/retry
 */
export const retryAssignment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const assignment = await Assignment.findOne({ _id: id, userId: req.user?.userId });

  if (!assignment) {
    throw new ApiError(404, 'Assignment not found');
  }

  if (assignment.status !== 'failed') {
    throw new ApiError(400, 'Only failed assignments can be retried');
  }

  assignment.status = 'uploaded';
  assignment.progress = 5;
  assignment.currentStep = 'Retrying processing...';
  assignment.error = undefined;
  await assignment.save();

  queueOcrProcessing(assignment._id.toString());

  res.status(202).json({
    message: 'Processing retried.',
    assignmentId: assignment._id,
  });
});

/**
 * Get Assignment Status
 * GET /api/upload/assignment/:id/status
 */
export const getAssignmentStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const assignment = await Assignment.findOne({ _id: id, userId: req.user?.userId })
    .select('status progress currentStep error metadata');

  if (!assignment) {
    throw new ApiError(404, 'Assignment not found');
  }

  res.status(200).json(assignment);
});

/**
 * Delete Assignment
 * DELETE /api/upload/assignment/:id
 */
export const deleteAssignment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const assignment = await Assignment.findOne({ _id: id, userId: req.user?.userId });

  if (!assignment) {
    throw new ApiError(404, 'Assignment not found');
  }

  // Delete physical files
  for (const file of assignment.files) {
    await storageService.deleteFile(`${req.user?.userId}/assignments/${file.storedName}`);
  }

  // Refund credit if processing never completed
  if (['uploading', 'uploaded', 'failed'].includes(assignment.status)) {
    const user = await User.findById(req.user?.userId);
    if (user) {
      user.credits += 1;
      await user.save();
    }
  }

  await Assignment.deleteOne({ _id: id });

  res.status(200).json({ message: 'Assignment deleted' });
});
