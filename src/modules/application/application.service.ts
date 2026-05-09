import prisma from '../../lib/prisma';
import AppError from '../../shared/appError';
import { QueryBuilder } from '../../shared/QueryBuilder';
import { ICreateApplication } from './application.interface';

const applyToJob = async (userId: string, payload: ICreateApplication) => {
  const job = await prisma.job.findUnique({ where: { id: payload.jobId } });

  if (!job || !job.isActive) {
    throw new AppError(404, 'Job not found or no longer active');
  }

  const existing = await prisma.application.findUnique({
    where: {
      jobId_userId: {
        jobId: payload.jobId,
        userId,
      },
    },
  });

  if (existing) {
    throw new AppError(409, 'You have already applied to this job');
  }

  const application = await prisma.application.create({
    data: {
      jobId: payload.jobId,
      userId,
      coverLetter: payload.coverLetter,
      resumeUrl: payload.resumeUrl,
    },
    include: {
      job: {
        select: {
          id: true,
          title: true,
          location: true,
          type: true,
          company: {
            select: {
              companyName: true,
              logo: true,
            },
          },
        },
      },
    },
  });

  return application;
};

const getMyApplications = async (userId: string, query: Record<string, any>) => {
  const result = await new QueryBuilder(prisma.application, query, {
    searchableFields: [],
    filterableFields: ['status'],
    defaultSortBy: 'createdAt',
    defaultSortOrder: 'desc',
  })
    .filter()
    .where({ userId })
    .sort()
    .paginate()
    .execute({
      job: {
        select: {
          id: true,
          title: true,
          location: true,
          type: true,
          salaryMin: true,
          salaryMax: true,
          company: {
            select: {
              companyName: true,
              logo: true,
            },
          },
        },
      },
    });

  return result;
};

const getApplicationById = async (userId: string, applicationId: string) => {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      job: {
        include: {
          company: {
            select: {
              companyName: true,
              logo: true,
              website: true,
            },
          },
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
    },
  });

  if (!application) {
    throw new AppError(404, 'Application not found');
  }

  // only the applicant or the company that owns the job can view it
  const company = await prisma.companyProfile.findUnique({ where: { userId } });
  const isApplicant = application.userId === userId;
  const isJobOwner = company && application.job.companyId === company.id;

  if (!isApplicant && !isJobOwner) {
    throw new AppError(403, 'You do not have permission to view this application');
  }

  return application;
};

export const ApplicationService = {
  applyToJob,
  getMyApplications,
  getApplicationById,
};