import prisma from '../../lib/prisma';
import AppError from '../../shared/appError';
import { IUpdateUser } from './user.interface';

const getMyProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      image: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  return user;
};

const updateMyProfile = async (userId: string, payload: IUpdateUser) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: payload,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      image: true,
      role: true,
      isActive: true,
      updatedAt: true,
    },
  });

  return updated;
};

export const UserService = {
  getMyProfile,
  updateMyProfile,
};