
import { Controller, Post, Get, Param } from '@nestjs/common';
import { BackupService } from './backup.service';

@Controller('backup')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Post('manual')
  async manualBackup() {
    return await this.backupService.triggerManualBackup();
  }

  @Post('full')
  async fullBackup() {
    return await this.backupService.createFullBackup();
  }

  @Post('tables')
  async tableBackups() {
    return await this.backupService.createTableBackups();
  }

  @Post('json/:tableName')
  async jsonBackup(@Param('tableName') tableName: string) {
    return await this.backupService.createJsonBackup(tableName);
  }

  @Post('restore/:filename')
  async restore(@Param('filename') filename: string) {
    const backupPath = `./backups/${filename}`;
    return await this.backupService.restoreBackup(backupPath);
  }
}
