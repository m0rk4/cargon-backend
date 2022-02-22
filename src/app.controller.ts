import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Post as PostModel } from '@prisma/client';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('post')
  async createDraft(
    @Body() postData: { title: string; content? },
  ): Promise<PostModel> {
    const { title, content } = postData;
    return this.appService.createPost({
      title,
      content,
    });
  }
}
