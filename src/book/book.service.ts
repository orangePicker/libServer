import { HttpException, Injectable } from '@nestjs/common';
import { AddBookDto } from './dto/add-book.dto';
// import { UpdateBookDto } from './dto/update-book.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FindBookDto } from './dto/find-bool.dto';
import { UtilsService } from 'src/utils/utils.service';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookService {
  constructor(private readonly prismaDB: PrismaService) {}

  // 添加书籍
  async addBook(bookInfo: AddBookDto) {
    try {
      // 验证书是否存在
      const book = await this.prismaDB.book.findMany({
        where: {
          bookTitle: bookInfo.bookTitle,
        },
      });
      if (book.length >= 1) {
        return {
          message: '这本书已存在',
          code: 0,
        };
      }

      // 添加书本
      const addRes = await this.prismaDB.book.create({
        data: {
          bookTitle: bookInfo.bookTitle,
          author: bookInfo.author || '',
          lendState: bookInfo.lendState,
        },
      });
      if (addRes) {
        return {
          message: '添加成功',
        };
      }
    } catch (error) {
      throw new HttpException('书籍添加失败 Service', 500);
    }
  }

  // 查询书籍
  async querBooks(query: FindBookDto) {
    try {
      const filterQuery = UtilsService.filterObject(query);
      return await this.prismaDB.book.findMany({
        where: {
          ...filterQuery,
        },
      });
    } catch (error) {
      console.log(error);
      throw new HttpException('查询书籍失败 Service', 500);
    }
  }

  // 编辑书籍
  async editBook(bookInfo: UpdateBookDto) {
    try {
      const { id, bookTitle, author, lendState } = bookInfo;
      // 添加书本
      return await this.prismaDB.book.update({
        where: {
          id,
        },
        data: {
          bookTitle,
          author,
          lendState,
        },
      });
    } catch (error) {
      throw new HttpException('书籍添加失败 Service', 500);
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
        return {
          message: '不存在该书籍',
          code: 0,
        };
      }
      if (books[0].lendState === 1) {
        return {
          message: '书籍正在出借中',
          code: 0,
        };
      }
      const result = await this.prismaDB.book.delete({
        where: {
          id,
        },
      });
      if (!result) {
        return {
          message: '删除失败',
          code: 0,
        };
      }
      return {
        message: '删除成功',
      };
    } catch (error) {
      throw new HttpException('书籍删除失败 Service', 500);
    }
  }
}
