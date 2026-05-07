import { Request, Response } from 'express';
import catchAsync from '../../shared/catchAsync';
import { JobService } from './job.service';
import { createJobSchema, updateJobSchema } from './job.validation';

const getAllJobs = catchAsync(async (req: Request, res: Response) => {
  const result = await JobService.getAllJobs(req.query);
  res.status(200).json({
    success: true,
    message: 'Jobs retrieved successfully',
    ...result,
  });
});

const getJobById = catchAsync(async (req: Request, res: Response) => {
  const job = await JobService.getJobById(req.params.id as string);
  res.status(200).json({
    success: true,
    message: 'Job retrieved successfully',
    data: job,
  });
});

const getMyJobs = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const result = await JobService.getMyJobs(userId, req.query);
  res.status(200).json({
    success: true,
    message: 'Your jobs retrieved successfully',
    ...result,
  });
});

const createJob = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const payload = createJobSchema.parse(req.body);
  const job = await JobService.createJob(userId, payload);
  res.status(201).json({
    success: true,
    message: 'Job created successfully',
    data: job,
  });
});

const updateJob = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const payload = updateJobSchema.parse(req.body);
  const job = await JobService.updateJob(userId, req.params.id as string, payload);
  res.status(200).json({
    success: true,
    message: 'Job updated successfully',
    data: job,
  });
});

const deleteJob = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  await JobService.deleteJob(userId, req.params.id as string);
  res.status(200).json({
    success: true,
    message: 'Job deleted successfully',
    data: null,
  });
});

export const JobController = {
  getAllJobs,
  getJobById,
  getMyJobs,
  createJob,
  updateJob,
  deleteJob,
};