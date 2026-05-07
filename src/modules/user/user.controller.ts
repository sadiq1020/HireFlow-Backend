import { Request, Response } from 'express';
import catchAsync from '../../shared/catchAsync';
import { UserService } from './user.service';
import { updateUserSchema } from './user.validation';

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const user = await UserService.getMyProfile(userId);
  res.status(200).json({
    success: true,
    message: 'Profile retrieved successfully',
    data: user,
  });
});

const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const payload = updateUserSchema.parse(req.body);
  const user = await UserService.updateMyProfile(userId, payload);
  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: user,
  });
});

export const UserController = {
  getMyProfile,
  updateMyProfile,
};