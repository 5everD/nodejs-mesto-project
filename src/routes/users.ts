import { Router } from 'express';
import { getUsers, getUserById, createUser, updateUser, updateAvatar } from '../controllers/users'

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/:userId', getUserById);
userRouter.post('/', createUser);
userRouter.patch('/me', updateUser);
userRouter.patch('/me/avatar', updateAvatar);

export default userRouter;