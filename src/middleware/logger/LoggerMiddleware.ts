import * as fs from 'node:fs';
import * as log4js from 'log4js';

export class LoggerMiddleware {
  private logPath = 'src/log/runtime-logger.log';
  private errLogPath = 'src/log/error-logger.log';
  private logger: log4js.Logger = null;
  constructor() {
    console.log('new logger');

    this.createLogger();
  }

  // 输出logger
  public showLogger = (text: string, type: string = 'info') => {
    this.logger.level = type;
    type === 'info' ? this.logger.info(text) : this.logger.error(text);
    this.saveLogs(text, type === 'info' ? this.logPath : this.errLogPath);
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
}
