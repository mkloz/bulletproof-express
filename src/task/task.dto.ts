import { z } from 'zod';

export const CreateTaskDtoValidator = z.object({
  isDone: z.boolean().optional(),
  title: z.string().min(1),
  discription: z.string().optional(),
});
export type CreateTaskDto = z.infer<typeof CreateTaskDtoValidator>;

export const UpdateTaskDtoValidator = z.object({
  isDone: z.boolean().optional(),
  title: z.string().min(1).optional(),
  discription: z.string().optional(),
});
export type UpdateTaskDto = z.infer<typeof UpdateTaskDtoValidator>;
