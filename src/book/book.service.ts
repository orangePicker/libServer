import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AddBookDto } from './dto/add-book.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FindBookDto } from './dto/find-bool.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { filterObject, serviceReturn } from 'src/utils/utils';

@Injectable()
export class BookService {
  constructor(private readonly prismaDB: PrismaService) {}

  // 添加书籍
  async addBook(bookInfo: AddBookDto) {
      // 验证书是否存在
      const book = await this.prismaDB.book.findMany({
        where: {
          bookTitle: bookInfo.bookTitle,
        },
      });
      if (book.length >= 1) {
        return serviceReturn('这本书已存在')
      }

      // 添加书本
      const addRes = await this.prismaDB.book.create({
        data: {
          bookTitle: bookInfo.bookTitle,
          author: bookInfo.author || '',
          lendState: bookInfo.lendState,
        },
      });
      if (!addRes) {
        return serviceReturn('添加失败')
      }
      return serviceReturn('添加成功',true)
  }

  // 查询书籍
  async querBooks(query: FindBookDto) {
    try {
      const filterQuery = filterObject(query);
      const result = await this.prismaDB.book.findMany({
        where: {
          ...filterQuery,
        },
      });

      return serviceReturn('',true,result)
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 编辑书籍
  async editBook(bookInfo: UpdateBookDto) {
    try {
      const { id, bookTitle, author, lendState } = bookInfo;
      // 编辑书本
      const result = await this.prismaDB.book.update({
        where: {
          id,
        },
        data: {
          bookTitle,
          author,
          lendState,
        },
      });

      return result
        ? serviceReturn('编辑成功', true)
        : serviceReturn('编辑失败');
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 删除书籍
  async deleteBook(bookInfo: UpdateBookDto) {
    try {
      const { id } = bookInfo;
      // 是否处于借阅状态
      const books = await this.prismaDB.book.findMany({
        where: {
          id,
        },
      });
      if (books.length <= 0) {
        return serviceReturn('书籍不存在');
      }
      if (books[0].lendState === 1) {
        return serviceReturn('书籍正在出借中');
      }
      const result = await this.prismaDB.book.delete({
        where: {
          id,
        },
      });
      if (!result) {
        return serviceReturn('删除失败');
      }
      return serviceReturn('删除成功', true);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
