import prisma from '../../lib/prisma';
import AppError from '../../shared/appError';

const saveJob = async (userId: string, jobId: string) => {
  const job = await prisma.job.findUnique({ where: { id: jobId } });

  if (!job || !job.isActive) {
    throw new AppError(404, 'Job not found or no longer active');
  }

  const existing = await prisma.savedJob.findUnique({
    where: {
      jobId_userId: { jobId, userId },
    },
  });

  if (existing) {
    throw new AppError(409, 'Job already saved');
  }

  const saved = await prisma.savedJob.create({
    data: { jobId, userId },
    include: {
      job: {
        select: {
          id: true,
          title: true,
          location: true,
          type: true,
          company: {
            select: { companyName: true, logo: true },
          },
        },
      },
    },
  });

  return saved;
};

const unsaveJob = async (userId: string, jobId: string) => {
  const existing = await prisma.savedJob.findUnique({
    where: {
      jobId_userId: { jobId, userId },
    },
  });

  if (!existing) {
    throw new AppError(404, 'Saved job not found');
  }

  await prisma.savedJob.delete({
    where: {
      jobId_userId: { jobId, userId },
    },
  });
};

const getMySavedJobs = async (userId: string) => {
  const savedJobs = await prisma.savedJob.findMany({
    where: { userId },
    include: {
      job: {
        select: {
          id: true,
          title: true,
          location: true,
          type: true,
          salaryMin: true,
          salaryMax: true,
          deadline: true,
          isActive: true,
          company: {
            select: { companyName: true, logo: true },
          },
          category: {
            select: { name: true, icon: true },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return savedJobs;
};

export const SavedJobService = {
  saveJob,
  unsaveJob,
  getMySavedJobs,
};