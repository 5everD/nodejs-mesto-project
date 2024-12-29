import mongoose from "mongoose";

interface IUser {
  name: string;
  about: string;
  avatar: string;
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [2, 'Минимальная длина поля "name" - 2 символа'],
      maxlength: [30, 'Максимальная длина поля "name" - 30 символов'],
      required: [true, 'Поле "name" должно быть заполнено'],
    },
    about: {
      type: String,
      minlength: [2, 'Минимальная длина поля "about" - 2 символа'],
      maxlength: [30, 'Максимальная длина поля "about" - 200 символов'],
      required: [true, 'Поле "about" должно быть заполнено'],
    },
    avatar: {
      type: String,
      required: [true, 'В поле "avatar" должна быть указана ссылка на аватар'],
    },
  },
  { versionKey: false }
);

export default mongoose.model<IUser>('user', userSchema);
