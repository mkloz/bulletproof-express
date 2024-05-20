import { Task } from '../task/task.entity';

export class User {
  id: number;
  email: string;
  name: string;
  password?: string;
  tasks?: Task[];

  constructor(data: Partial<User>) {
    Object.assign(this, data);

    if (data.tasks?.length) {
      this.tasks = data.tasks.map((task) => new Task(task));
    }
  }
}
