import { Controller, Get, Query } from '@nestjs/common';
import { type HelloDto } from '../models/helloDto';

@Controller()
export class ApiController {
  @Get('hello')
  getHello(@Query('name') name: string = 'world'): HelloDto {
    return {
      message: `Hello ${name}!`,
    };
  }
}
