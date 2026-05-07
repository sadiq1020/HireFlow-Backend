import { Request, Response } from 'express';
import catchAsync from '../../shared/catchAsync';
import { AdminService } from './admin.service';
import { approveCompanySchema, updateUserStatusSchema } from './admin.validation';

const getStats = catchAsync(async (req: Request, res: Response) => {
  const stats = await AdminService.getStats();
  res.status(200).json({
    success: true,
    message: 'Stats retrieved successfully',
    data: stats,
  });
});

const getEnrollmentTrend = catchAsync(async (req: Request, res: Response) => {
  const data = await AdminService.getEnrollmentTrend();
  res.status(200).json({
    success: true,
    message: 'Application trend retrieved successfully',
    data,
  });
});

const getJobTrend = catchAsync(async (req: Request, res: Response) => {
  const data = await AdminService.getJobTrend();
  res.status(200).json({
    success: true,
    message: 'Job trend retrieved successfully',
    data,
  });
});

const getCategoryDistribution = catchAsync(async (req: Request, res: Response) => {
  const data = await AdminService.getCategoryDistribution();
  res.status(200).json({
    success: true,
    message: 'Category distribution retrieved successfully',
    data,
  });
});

const getUserRoleDistribution = catchAsync(async (req: Request, res: Response) => {
  const data = await AdminService.getUserRoleDistribution();
  res.status(200).json({
    success: true,
    message: 'User role distribution retrieved successfully',
    data,
  });
});

const getAllCompanies = catchAsync(async (req: Request, res: Response) => {
  const companies = await AdminService.getAllCompanies();
  res.status(200).json({
    success: true,
    message: 'Companies retrieved successfully',
    data: companies,
  });
});

const updateCompanyApproval = catchAsync(async (req: Request, res: Response) => {
  const { status, rejectionNote } = approveCompanySchema.parse(req.body);
  const company = await AdminService.updateCompanyApproval(
    req.params.id as string,
    status,
    rejectionNote,
  );
  res.status(200).json({
    success: true,
    message: `Company ${status.toLowerCase()} successfully`,
    data: company,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await AdminService.getAllUsers();
  res.status(200).json({
    success: true,
    message: 'Users retrieved successfully',
    data: users,
  });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const { isActive } = updateUserStatusSchema.parse(req.body);
  const user = await AdminService.updateUserStatus(
    req.params.id as string,
    isActive,
  );
  res.status(200).json({
    success: true,
    message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
    data: user,
  });
});

export const AdminController = {
  getStats,
  getEnrollmentTrend,
  getJobTrend,
  getCategoryDistribution,
  getUserRoleDistribution,
  getAllCompanies,
  updateCompanyApproval,
  getAllUsers,
  updateUserStatus,
};