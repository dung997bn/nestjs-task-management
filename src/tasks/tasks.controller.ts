import { Body, Controller, Delete, Get, Logger, Param, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { json } from 'express';
import { GetUser } from 'src/auth/get-user.decoded';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dtos/create-task.dto';
import { GetTasksFilterDto } from './dtos/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@ApiTags('tasks')
@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    private logger = new Logger('TasksController')

    constructor(private tasksService: TasksService) { }

    @Get()
    getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto,
        @GetUser() user: User): Promise<Task[]> {
        this.logger.verbose(`User "${user.username}" retrieving all tasks.Filers: ${JSON.stringify(filterDto)}`)
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
    createTask(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User): Promise<Task> {
        return this.tasksService.createTask(createTaskDto, user)
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
