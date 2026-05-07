import { Request, Response } from 'express';
import catchAsync from '../../shared/catchAsync';
import { SavedJobService } from './savedJob.service';
import { saveJobSchema } from './savedJob.validation';

const saveJob = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { jobId } = saveJobSchema.parse(req.body);
  const saved = await SavedJobService.saveJob(userId, jobId);
  res.status(201).json({
    success: true,
    message: 'Job saved successfully',
    data: saved,
  });
});

const unsaveJob = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  await SavedJobService.unsaveJob(userId, req.params.jobId as string);
  res.status(200).json({
    success: true,
    message: 'Job removed from saved list',
    data: null,
  });
});

const getMySavedJobs = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const savedJobs = await SavedJobService.getMySavedJobs(userId);
  res.status(200).json({
    success: true,
    message: 'Saved jobs retrieved successfully',
    data: savedJobs,
  });
});

export const SavedJobController = {
  saveJob,
  unsaveJob,
  getMySavedJobs,
};