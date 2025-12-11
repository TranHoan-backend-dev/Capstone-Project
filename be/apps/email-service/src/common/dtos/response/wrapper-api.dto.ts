import { ApiProperty } from "@nestjs/swagger";

export class WrapperApiDto {
    @ApiProperty()
    status!: number;

    @ApiProperty()
    message!: string;

    @ApiProperty({ required: false })
    data?: any;

    @ApiProperty()
    timestamp!: Date;
}