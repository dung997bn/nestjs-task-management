import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsNotEmpty, IsOptional } from "class-validator";
import { TaskStatus } from "../task-status.enum";

export class GetTasksFilterDto {
    @IsOptional()
    @ApiProperty()
    @IsIn([TaskStatus.DONE, TaskStatus.OPEN, TaskStatus.IN_PROGRESS])
    status: TaskStatus

    @IsOptional()
    @IsNotEmpty()
    @ApiProperty()
    search: string
}