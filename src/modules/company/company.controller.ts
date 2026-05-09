import { Request, Response } from 'express';
import catchAsync from '../../shared/catchAsync';
import { CompanyService } from './company.service';
import {
  createCompanySchema,
  updateApplicationStatusSchema,
  updateCompanySchema,
} from './company.validation';

const registerCompany = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const payload = createCompanySchema.parse(req.body);
  const company = await CompanyService.registerCompany(userId, payload);
  res.status(201).json({
    success: true,
    message: 'Company registered successfully. Awaiting admin approval.',
    data: company,
  });
});

const getMyCompanyProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const company = await CompanyService.getMyCompanyProfile(userId);
  res.status(200).json({
    success: true,
    message: 'Company profile retrieved successfully',
    data: company,
  });
});

const updateMyCompanyProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const payload = updateCompanySchema.parse(req.body);
  const company = await CompanyService.updateMyCompanyProfile(userId, payload);
  res.status(200).json({
    success: true,
    message: 'Company profile updated successfully',
    data: company,
  });
});

const getCompanyApplications = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const result = await CompanyService.getCompanyApplications(userId, req.query);
  res.status(200).json({
    success: true,
    message: 'Applications retrieved successfully',
    ...result,
  });
});

const updateApplicationStatus = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { status } = updateApplicationStatusSchema.parse(req.body);
  const company = await CompanyService.updateApplicationStatus(
    userId,
    req.params.applicationId as string,
    status as any,
  );
  res.status(200).json({
    success: true,
    message: 'Application status updated successfully',
    data: company,
  });
});

const getPublicCompanyList = catchAsync(async (req: Request, res: Response) => {
  const result = await CompanyService.getPublicCompanyList(req.query);
  res.status(200).json({
    success: true,
    message: 'Companies retrieved successfully',
    ...result,
  });
});

const getPublicCompanyById = catchAsync(async (req: Request, res: Response) => {
  const company = await CompanyService.getPublicCompanyById(req.params.id as string);
  res.status(200).json({
    success: true,
    message: 'Company retrieved successfully',
    data: company,
  });
});

export const CompanyController = {
  registerCompany,
  getMyCompanyProfile,
  updateMyCompanyProfile,
  getCompanyApplications,
  updateApplicationStatus,
  getPublicCompanyList,
  getPublicCompanyById,
};