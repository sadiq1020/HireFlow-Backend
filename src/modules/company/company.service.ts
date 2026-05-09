import { ApplicationStatus, Role } from '../../../generated/prisma';
import prisma from '../../lib/prisma';
import AppError from '../../shared/appError';
import { QueryBuilder } from '../../shared/QueryBuilder';
import { ICreateCompany, IUpdateCompany } from './company.interface';

const registerCompany = async (userId: string, payload: ICreateCompany) => {
  const existing = await prisma.companyProfile.findUnique({
    where: { userId },
  });

  if (existing) {
    throw new AppError(409, 'You have already registered a company profile');
  }

  // Update user role to COMPANY
  await prisma.user.update({
    where: { id: userId },
    data: { role: Role.COMPANY },
  });

  const company = await prisma.companyProfile.create({
    data: {
      ...payload,
      userId,
    },
  });

  return company;
};

const getMyCompanyProfile = async (userId: string) => {
  const company = await prisma.companyProfile.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          phone: true,
          image: true,
        },
      },
    },
  });

  if (!company) {
    throw new AppError(404, 'Company profile not found');
  }

  return company;
};

const updateMyCompanyProfile = async (userId: string, payload: IUpdateCompany) => {
  const company = await prisma.companyProfile.findUnique({
    where: { userId },
  });

  if (!company) {
    throw new AppError(404, 'Company profile not found');
  }

  const updated = await prisma.companyProfile.update({
    where: { userId },
    data: payload,
  });

  return updated;
};

const getCompanyApplications = async (userId: string, query: Record<string, any>) => {
  const company = await prisma.companyProfile.findUnique({
    where: { userId },
  });

  if (!company) {
    throw new AppError(404, 'Company profile not found');
  }

  const result = await new QueryBuilder(prisma.application, query, {
    searchableFields: [],
    filterableFields: ['status', 'jobId'],
    defaultSortBy: 'createdAt',
    defaultSortOrder: 'desc',
  })
    .filter()
    .where({ job: { companyId: company.id } })
    .sort()
    .paginate()
    .execute({
      job: {
        select: {
          id: true,
          title: true,
          location: true,
          type: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          image: true,
        },
      },
    });

  return result;
};

const updateApplicationStatus = async (
  userId: string,
  applicationId: string,
  status: ApplicationStatus,
) => {
  const company = await prisma.companyProfile.findUnique({
    where: { userId },
  });

  if (!company) {
    throw new AppError(404, 'Company profile not found');
  }

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { job: true },
  });

  if (!application) {
    throw new AppError(404, 'Application not found');
  }

  if (application.job.companyId !== company.id) {
    throw new AppError(403, 'You do not have permission to update this application');
  }

  const updated = await prisma.application.update({
    where: { id: applicationId },
    data: { status },
  });

  return updated;
};

const getPublicCompanyList = async (query: Record<string, any>) => {
  const result = await new QueryBuilder(prisma.companyProfile, query, {
    searchableFields: ['companyName', 'description', 'location', 'industry'],
    filterableFields: ['industry'],
    defaultSortBy: 'createdAt',
    defaultSortOrder: 'desc',
  })
    .search()
    .filter()
    .where({ approvalStatus: 'APPROVED' })
    .sort()
    .paginate()
    .execute({
      user: {
        select: { name: true, email: true, image: true },
      },
      _count: { select: { jobs: true } },
    });

  return result;
};

const getPublicCompanyById = async (id: string) => {
  const company = await prisma.companyProfile.findUnique({
    where: { id },
    include: {
      user: {
        select: { name: true, email: true, image: true },
      },
      jobs: {
        where: { isActive: true },
        select: {
          id: true,
          title: true,
          location: true,
          type: true,
          salaryMin: true,
          salaryMax: true,
          createdAt: true,
        },
      },
    },
  });

  if (!company || company.approvalStatus !== 'APPROVED') {
    throw new AppError(404, 'Company not found');
  }

  return company;
};

export const CompanyService = {
  registerCompany,
  getMyCompanyProfile,
  updateMyCompanyProfile,
  getCompanyApplications,
  updateApplicationStatus,
  getPublicCompanyList,
  getPublicCompanyById,
};