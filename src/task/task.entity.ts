import { User } from '../user/user.entity';

export class Task {
  id: number;
  isDone: boolean;
  title: string;
  discription: string | null;
  userId: number;
  user?: User;

  constructor(data: Partial<Task>) {
    Object.assign(this, data);

    if (data.user) {
      this.user = new User(data.user);
    }
  }
}
