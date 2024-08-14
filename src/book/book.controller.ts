import {
  Controller,
  Post as PostMapping,
  Body,
  HttpException,
  UseInterceptors,
  HttpStatus,
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
      const { message, success } = await this.bookService.addBook(bookInfo);
      return success ? { message } : { message, code: 0 };
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 查询
  @PostMapping('queryBooks')
  async querBooks(@Body() query: FindBookDto) {
    try {
      const { data } = await this.bookService.querBooks(query);

      return {
        data: {
          books: data,
          total: data.length || 0,
        },
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 编辑
  @PostMapping('editBook')
  async editBook(@Body() bookInfo: UpdateBookDto) {
    try {
      const { message, success } = await this.bookService.editBook(bookInfo);

      return success
        ? { message }
        : {
            message,
            code: 0,
          };
    } catch (error) {
      throw new Error(error);
    }
  }

  // 删除
  @PostMapping('deleteBook')
  async deleteBook(@Body() bookInfo: UpdateBookDto) {
    try {
      const { message, success } = await this.bookService.deleteBook(bookInfo);
      if (!success) {
        return {
          message,
          code: 0,
        };
      }
      return {
        message,
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
