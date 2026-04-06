import { IsString, IsNotEmpty, IsEnum, IsDateString, IsOptional, IsNumber, Min } from "class-validator";
import { Type } from "class-transformer";

export enum RecordType {
    INCOME = "INCOME",
    EXPENSE = "EXPENSE",
}

export class CreateFinancialRecordDto {
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    @Type(() => Number)
    amount!: number;

    @IsEnum(RecordType)
    @IsNotEmpty()
    type!: RecordType;

    @IsString()
    @IsNotEmpty()
    category!: string;

    @IsDateString()
    @IsNotEmpty()
    date!: string;

    @IsString()
    @IsOptional()
    notes?: string;
}