import { ApprovalStatus } from '../../../generated/prisma';
import cache from '../../config/cache';
import prisma from '../../lib/prisma';
import AppError from '../../shared/appError';



const getStats = async () => {
  const cacheKey = 'admin:stats';
  const cached = cache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const [
    totalUsers,
    totalCompanies,
    totalJobs,
    totalApplications,
    totalCategories,
    pendingCompanies,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.companyProfile.count(),
    prisma.job.count(),
    prisma.application.count(),
    prisma.category.count(),
    prisma.companyProfile.count({ where: { approvalStatus: 'PENDING' } }),
  ]);

  const stats = {
    totalUsers,
    totalCompanies,
    totalJobs,
    totalApplications,
    totalCategories,
    pendingCompanies,
  };

  cache.set(cacheKey, stats, 120); // cache for 2 minutes

  return stats;
};

const getEnrollmentTrend = async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const applications = await prisma.application.findMany({
    where: { createdAt: { gte: thirtyDaysAgo } },
    select: { createdAt: true },
    orderBy: { createdAt: 'asc' },
  });

  // Group by date
  const grouped: Record<string, number> = {};
  applications.forEach((app) => {
    const date = app.createdAt.toISOString().split('T')[0];
    grouped[date] = (grouped[date] || 0) + 1;
  });

  return Object.entries(grouped).map(([date, count]) => ({ date, count }));
};

const getJobTrend = async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const jobs = await prisma.job.findMany({
    where: { createdAt: { gte: thirtyDaysAgo } },
    select: { createdAt: true },
    orderBy: { createdAt: 'asc' },
  });

  const grouped: Record<string, number> = {};
  jobs.forEach((job) => {
    const date = job.createdAt.toISOString().split('T')[0];
    grouped[date] = (grouped[date] || 0) + 1;
  });

  return Object.entries(grouped).map(([date, count]) => ({ date, count }));
};

const getCategoryDistribution = async () => {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { jobs: true } },
    },
  });

  return categories.map((cat) => ({
    name: cat.name,
    icon: cat.icon,
    jobCount: cat._count.jobs,
  }));
};

const getUserRoleDistribution = async () => {
  const [admins, companies, seekers] = await Promise.all([
    prisma.user.count({ where: { role: 'ADMIN' } }),
    prisma.user.count({ where: { role: 'COMPANY' } }),
    prisma.user.count({ where: { role: 'SEEKER' } }),
  ]);

  return [
    { role: 'ADMIN', count: admins },
    { role: 'COMPANY', count: companies },
    { role: 'SEEKER', count: seekers },
  ];
};

const getAllCompanies = async () => {
  const companies = await prisma.companyProfile.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          isActive: true,
        },
      },
      _count: { select: { jobs: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return companies;
};

const updateCompanyApproval = async (
  companyId: string,
  status: string,
  rejectionNote?: string,
) => {
  const company = await prisma.companyProfile.findUnique({
    where: { id: companyId },
  });

  if (!company) {
    throw new AppError(404, 'Company not found');
  }

  const updated = await prisma.companyProfile.update({
  where: { id: companyId },
  data: {
    approvalStatus: status as ApprovalStatus,
    rejectionNote: rejectionNote || null,
  },
});

  return updated;
};

const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      image: true,
      phone: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return users;
};

const updateUserStatus = async (userId: string, isActive: boolean) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  if (user.role === 'ADMIN') {
    throw new AppError(403, 'Cannot change the status of an admin user');
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { isActive },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
    },
  });

  return updated;
};

export const AdminService = {
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