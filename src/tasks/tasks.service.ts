import { Injectable, Ip, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dtos/create-task.dto';
import { GetTasksFilterDto } from './dtos/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
    constructor(@InjectRepository(TaskRepository) private taskRepository: TaskRepository) { }

    async getAllTasks(): Promise<Task[]> {
        return await this.taskRepository.find()
    }

    async getTaskById(id: number): Promise<Task> {
        const found = await this.taskRepository.findOne(id)
        if (!found) {
            throw new NotFoundException("Task not found")
        }
        return found
    }

    async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
        const { status, search } = filterDto
        const query = this.taskRepository.createQueryBuilder('task')

        if (status) {
            query.andWhere('task.status = :status', { status })
        }

        if (search) {
            query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', { search: `%${search}%` })
        }
        const tasks = await query.getMany()
        return tasks
    }

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        const task = new Task()
        task.title = createTaskDto.title
        task.description = createTaskDto.description
        task.status = TaskStatus.OPEN
        task.user = user
        await task.save()
        delete task.user
        return task
    }

    async deleteTask(id: number): Promise<void> {
        const found = await this.getTaskById(id)

        if (!found) {
            throw new NotFoundException("Task not found")
        }
        await this.taskRepository.delete(found.id)
    }

    async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
        const task = await this.getTaskById(id)
        task.status = status
        await task.save()
        return task
    }
}
