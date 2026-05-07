import { JobType } from '../../../generated/prisma';
import prisma from '../../lib/prisma';
import AppError from '../../shared/appError';
import { QueryBuilder } from '../../shared/QueryBuilder';
import { ICreateJob, IUpdateJob } from './job.interface';

const getAllJobs = async (query: Record<string, any>) => {
  const result = await new QueryBuilder(prisma.job, query, {
    searchableFields: ['title', 'description', 'location'],
    filterableFields: ['type', 'categoryId', 'isActive'],
    defaultSortBy: 'createdAt',
    defaultSortOrder: 'desc',
  })
    .search()
    .filter()
    .where({ isActive: true })
    .sort()
    .paginate()
    .execute({
      company: {
        select: {
          id: true,
          companyName: true,
          logo: true,
          location: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          icon: true,
        },
      },
    });

  return result;
};

const getJobById = async (id: string) => {
  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      company: {
        select: {
          id: true,
          companyName: true,
          logo: true,
          location: true,
          website: true,
          description: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          icon: true,
        },
      },
      _count: { select: { applications: true } },
    },
  });

  if (!job) {
    throw new AppError(404, 'Job not found');
  }

  return job;
};

const getMyJobs = async (userId: string, query: Record<string, any>) => {
  const company = await prisma.companyProfile.findUnique({ where: { userId } });

  if (!company) {
    throw new AppError(404, 'Company profile not found');
  }

  const result = await new QueryBuilder(prisma.job, query, {
    searchableFields: ['title', 'location'],
    filterableFields: ['type', 'isActive'],
    defaultSortBy: 'createdAt',
    defaultSortOrder: 'desc',
  })
    .search()
    .filter()
    .where({ companyId: company.id })
    .sort()
    .paginate()
    .execute({
      category: { select: { id: true, name: true, icon: true } },
      _count: { select: { applications: true } },
    });

  return result;
};

const createJob = async (userId: string, payload: ICreateJob) => {
  const company = await prisma.companyProfile.findUnique({ where: { userId } });

  if (!company) {
    throw new AppError(404, 'Company profile not found');
  }

  if (company.approvalStatus !== 'APPROVED') {
    throw new AppError(403, 'Your company must be approved before posting jobs');
  }

  const category = await prisma.category.findUnique({
    where: { id: payload.categoryId },
  });

  if (!category) {
    throw new AppError(404, 'Category not found');
  }

  const job = await prisma.job.create({
    data: {
      title: payload.title,
      description: payload.description,
      requirements: payload.requirements,
      location: payload.location,
      type: payload.type as JobType,
      salaryMin: payload.salaryMin,
      salaryMax: payload.salaryMax,
      deadline: payload.deadline ? new Date(payload.deadline) : null,
      companyId: company.id,
      categoryId: payload.categoryId,
    },
  });

  return job;
};

const updateJob = async (userId: string, jobId: string, payload: IUpdateJob) => {
  const company = await prisma.companyProfile.findUnique({ where: { userId } });

  if (!company) {
    throw new AppError(404, 'Company profile not found');
  }

  const job = await prisma.job.findUnique({ where: { id: jobId } });

  if (!job) {
    throw new AppError(404, 'Job not found');
  }

  if (job.companyId !== company.id) {
    throw new AppError(403, 'You do not have permission to update this job');
  }

  const updated = await prisma.job.update({
    where: { id: jobId },
    data: {
      ...(payload.title && { title: payload.title }),
      ...(payload.description && { description: payload.description }),
      ...(payload.requirements && { requirements: payload.requirements }),
      ...(payload.location && { location: payload.location }),
      ...(payload.type && { type: payload.type as JobType }),
      ...(payload.salaryMin && { salaryMin: payload.salaryMin }),
      ...(payload.salaryMax && { salaryMax: payload.salaryMax }),
      ...(payload.categoryId && { categoryId: payload.categoryId }),
      ...(payload.isActive !== undefined && { isActive: payload.isActive }),
      ...(payload.deadline && { deadline: new Date(payload.deadline) }),
    },
  });

  return updated;
};

const deleteJob = async (userId: string, jobId: string) => {
  const company = await prisma.companyProfile.findUnique({ where: { userId } });

  if (!company) {
    throw new AppError(404, 'Company profile not found');
  }

  const job = await prisma.job.findUnique({ where: { id: jobId } });

  if (!job) {
    throw new AppError(404, 'Job not found');
  }

  if (job.companyId !== company.id) {
    throw new AppError(403, 'You do not have permission to delete this job');
  }

  await prisma.job.delete({ where: { id: jobId } });
};

export const JobService = {
  getAllJobs,
  getJobById,
  getMyJobs,
  createJob,
  updateJob,
  deleteJob,
};