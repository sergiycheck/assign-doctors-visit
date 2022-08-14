import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import fs from 'node:fs';
import path from 'node:path';

@Injectable({ scope: Scope.DEFAULT })
export class CustomLogger extends ConsoleLogger {
  constructor(private configService: ConfigService) {
    super();
  }
  customLog(msg: any, ...rest: any[]) {
    this.log(msg, ...rest);
  }

  log(message: any, context?: string): void;
  log(message: any, ...optionalParams: any[]): void;
  log(message: any, context?: any, ...rest: any[]): void {
    const envType = this.configService.get('NODE_ENV') as string;
    if (envType === 'dev') {
      super.log(message, context, ...rest);
    }
  }

  logToFile(message: string, filePathWithDir = './logs/notifications.log') {
    const fileName = path.resolve(process.cwd(), filePathWithDir);

    const writeStream = fs.createWriteStream(fileName);

    writeStream.write(message, 'utf8');

    writeStream.end();

    writeStream.on('finish', () => {
      this.log(`Write completed to file ${fileName}`);
    });

    writeStream.on('error', (err) => {
      this.error(err);
    });
  }
}
