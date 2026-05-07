import { Request, Response } from 'express';
import catchAsync from '../../shared/catchAsync';
import { ApplicationService } from './application.service';
import { createApplicationSchema } from './application.validation';

const applyToJob = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const payload = createApplicationSchema.parse(req.body);
  const application = await ApplicationService.applyToJob(userId, payload);
  res.status(201).json({
    success: true,
    message: 'Application submitted successfully',
    data: application,
  });
});

const getMyApplications = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const applications = await ApplicationService.getMyApplications(userId);
  res.status(200).json({
    success: true,
    message: 'Applications retrieved successfully',
    data: applications,
  });
});

const getApplicationById = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const application = await ApplicationService.getApplicationById(
    userId,
    req.params.id as string,
  );
  res.status(200).json({
    success: true,
    message: 'Application retrieved successfully',
    data: application,
  });
});

export const ApplicationController = {
  applyToJob,
  getMyApplications,
  getApplicationById,
};