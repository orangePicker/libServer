import {
  Controller,
  Post as PostMapping,
  Body,
  HttpException,
  UseInterceptors,
} from '@nestjs/common';
import { BookService } from './book.service';
import { AddBookDto } from './dto/add-book.dto';
import { FindBookDto } from './dto/find-bool.dto';
import { SuccessReaponse } from 'src/interceptor/successResponse';
import { UpdateBookDto } from './dto/update-book.dto';
// import { UpdateBookDto } from './dto/update-book.dto';

@Controller('book')
@UseInterceptors(SuccessReaponse)
export class BookController {
  constructor(private readonly bookService: BookService) {}

  // 添加
  @PostMapping('addBook')
  async addBook(@Body() bookInfo: AddBookDto) {
    try {
      const result = await this.bookService.addBook(bookInfo);
      return {
        ...result,
      };
    } catch (error) {
      throw new HttpException('addBookErr Ctrl', 500);
    }
  }

  // 查询
  @PostMapping('queryBooks')
  async querBooks(@Body() query: FindBookDto) {
    const books = await this.bookService.querBooks(query);
    return {
      data: {
        books,
        total: books.length || 0,
      },
    };
  }

  // 编辑
  @PostMapping('editBook')
  async editBook(@Body() bookInfo: UpdateBookDto) {
    try {
      const res = await this.bookService.editBook(bookInfo);
      if (!res) {
        return {
          message: '修改失败',
          code: 0,
        };
      }
      return {
        message: '修改成功',
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  // 删除
  @PostMapping('deleteBook')
  async deleteBook(@Body() bookInfo: UpdateBookDto) {
    try {
      return await this.bookService.deleteBook(bookInfo);
    } catch (error) {
      throw new HttpException('deleteBookErr Ctrl', 500);
    }
  }
}
