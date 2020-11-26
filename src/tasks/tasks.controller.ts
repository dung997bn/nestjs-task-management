import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateTaskDto } from './dtos/create-task.dto';
import { GetTasksFilterDto } from './dtos/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) { }

    @Get()
    getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto): Promise<Task[]> {
        return this.tasksService.getTasks(filterDto)
    }

    @Get('/getall')
    getAllTasks(): Promise<Task[]> {
        return this.tasksService.getAllTasks()
    }

    @Get('/:id')
    getTaskById(@Param('id') id: number): Promise<Task> {
        return this.tasksService.getTaskById(id)
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
        return this.tasksService.createTask(createTaskDto)
    }

    @Patch('/:id')
    updateTaskStatus(@Param('id') id: number, @Body('status', TaskStatusValidationPipe) status: TaskStatus): Promise<Task> {
        return this.tasksService.updateTaskStatus(id, status)
    }

    @Delete('/:id')
    deleteTask(@Param('id') id: number): Promise<void> {
        return this.tasksService.deleteTask(id)
    }
}
