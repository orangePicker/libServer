import * as fs from 'node:fs';
import * as log4js from 'log4js';
import * as path from 'node:path';
import { myEnv } from 'src/utils/utils';

export class LoggerMiddleware {
  private logFileName = 'runtime-logger.log';
  private errLogFileName = 'error-logger.log';
  private logPath = path.join(__dirname, myEnv.LOG_PATH);
  private errLogPath = path.join(__dirname, myEnv.LOG_PATH);
  private logger: log4js.Logger = null;

  constructor() {
    this.checkDir(this.logPath, this.logFileName);
    this.checkDir(this.errLogPath, this.errLogFileName);
    this.createLogger();
  }

  // 输出logger
  public showLogger = (text: string, type: string = 'info') => {
    this.logger.level = type;
    type === 'info' ? this.logger.info(text) : this.logger.error(text);
    this.saveLogs(
      text,
      type === 'info'
        ? path.join(this.logPath, this.logFileName)
        : path.join(this.errLogPath, this.errLogFileName),
    );
  };

  // 保存日志
  public saveLogs(text: string, path: string) {
    fs.writeFileSync(path, text, {
      encoding: 'utf-8',
      flag: 'a',
    });
  }

  // 保存错误日志
  //   public showAndSaveErroeLogs = (text: string) => {
  //     this.logger.level = 'error'
  //     this.logger.error(text)
  //     this.saveLogs(text,this.errLogPath)
  //   }

  // 创建logger
  createLogger() {
    this.logger = log4js.getLogger();
  }

  // 检查目录
  checkDir = (checkPath: string, fileName: string) => {
    const fullPath = path.join(checkPath, fileName);

    // 检查文件是否存在
    fs.access(fullPath, (err) => {
      if (err) {
        console.log('文件不存在，尝试重新创建...');
        // 创建目录
        fs.mkdir(checkPath, (err) => {
          err
            ? console.log('创建目录失败' + err)
            : console.log(`${checkPath} 已创建!`);
        });
        // 创建文件
        fs.appendFile(fullPath, '', 'utf-8', (err) => {
          err
            ? console.log('文件重新创建失败!')
            : console.log('文件重新创建成功!' + fullPath);
        });
      } else {
        console.log(`文件 ${fullPath} 存在!`);
      }
    });
  };
}
