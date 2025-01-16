import { Schema, model } from 'mongoose';
import validator from 'validator';

interface ICard {
  name: string;
  link: string;
  owner: Schema.Types.ObjectId;
  likes: Schema.Types.ObjectId[];
  createdAt: Date;
}

const cardSchema = new Schema<ICard>({
  name: {
    type: String,
    minlength: [2, 'Минимальная длина поля "name" - 2 символа'],
    maxlength: [30, 'Максимальная длина поля "name" - 30 символов'],
    required: [true, 'Поле "name" должно быть заполнено'],
  },
  link: {
    type: String,
    validate: {
      validator: (avatarValue: string) => validator.isURL(avatarValue),
      message: 'Некорректная ссылка',
    },
    required: [true, 'В поле "link" должна быть указана ссылка'],
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: {
    type: Array(Schema.Types.ObjectId),
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model<ICard>('card', cardSchema);
