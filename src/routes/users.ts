import { Router } from 'express';
import {
  getUsers, getUser, getUserById, updateUser, updateAvatar,
} from '../controllers/users';
import { userIdValidate, userUpdateAvatarValidate, userUpdateValidate } from '../utils/data-validate';

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/me', getUser);
userRouter.get('/:userId', userIdValidate, getUserById);
userRouter.patch('/me', userUpdateValidate, updateUser);
userRouter.patch('/me/avatar', userUpdateAvatarValidate, updateAvatar);

export default userRouter;
