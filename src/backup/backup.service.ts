import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';


const execPromise = promisify(exec);
// exec ni async/await bilan ishlatish uchun

// ===== SERVICE CLASS TUZILISHI =====

@Injectable() 
export class BackupService {
  
  // Logger - loglarni yozish uchun (console.log dan yaxshiroq)
  private readonly logger = new Logger(BackupService.name);
  // BackupService.name - log'larda qaysi class ekanini ko'rsatadi
  
  // Backup fayllar saqlanadigan papka yo'li
  private readonly backupDir = path.join(process.cwd(), 'backups');
  // process.cwd() - loyihaning asosiy papkasi
  // path.join() - "loyiha/backups" degan yo'l yaratadi

  constructor(
    @InjectDataSource() // Database connection ni inject qilish
    private dataSource: DataSource, // Database bilan ishlash uchun
  ) {
    // Agar backups papkasi yo'q bo'lsa, yaratamiz
    if (!fs.existsSync(this.backupDir)) {
      // existsSync - papka bormi yo'qmi tekshiradi
      fs.mkdirSync(this.backupDir, { recursive: true });
      // mkdirSync - papka yaratadi
      // recursive: true - kerak bo'lsa ota-papkalarni ham yaratadi
    }
  }

  // ===== CRON TASK 1: KUNLIK BACKUP =====
  
  @Cron(CronExpression.EVERY_WEEK, { // Har kuni soat 02:00 da
    name: 'daily-backup', // Task nomi (debuglash uchun)
    timeZone: 'Asia/Tashkent', // O'zbekiston vaqt zonasi
  })
  async handleDailyBackup() {
    // Bu funksiya har kuni soat 02:00 da avtomatik ishga tushadi
    this.logger.log('Kunlik backup boshlandi...');
    await this.createFullBackup(); // To'liq backup yaratamiz
  }

  // ===== CRON TASK 2: 6 SOATLIK BACKUP =====
  
  @Cron('0 */6 * * *', { // Har 6 soatda
    // */6 - har 6 soatda (0:00, 6:00, 12:00, 18:00)
    name: 'six-hour-backup',
    timeZone: 'Asia/Tashkent',
  })
  async handleSixHourBackup() {
    this.logger.log('6 soatlik backup boshlandi...');
    await this.createIncrementalBackup(); // Faqat o'zgarishlar
  }

  // ===== TO'LIQ DATABASE BACKUP =====
  
  async createFullBackup() {
    try {
      // 1. Fayl nomi uchun vaqt belgisi yaratamiz
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      // toISOString() -> "2024-11-06T14:30:00.000Z"
      // replace(/[:.]/g, '-') -> "2024-11-06T14-30-00-000Z"
      // Sababi: fayl nomida ":" bo'lmasligi kerak
      
      // 2. Backup fayl yo'li
      const backupFile = path.join(this.backupDir, `full_backup_${timestamp}.sql`);
      // Natija: "loyiha/backups/full_backup_2024-11-06T14-30-00.sql"

      // 3. Database connection ma'lumotlarini olamiz
      const { host, port, username, password, database } = 
        this.dataSource.options as any;
      // host - server manzili (masalan: localhost)
      // port - port raqami (masalan: 5432)
      // username - database useri (masalan: postgres)
      // password - parol
      // database - database nomi (masalan: mydb)

      // 4. PostgreSQL backup buyrug'i (pg_dump)
      const command = `PGPASSWORD="${password}" pg_dump -h ${host} -p ${port} -U ${username} -d ${database} -F p -f "${backupFile}"`;
      
      // BUYRUQ TUSHUNTIRILISHI:
      // PGPASSWORD="${password}" - parolni environment ga qo'yamiz
      // pg_dump - PostgreSQL backup dasturi
      // -h ${host} - host (server manzili)
      // -p ${port} - port raqami
      // -U ${username} - username (user nomi)
      // -d ${database} - database nomi
      // -F p - format: plain SQL
      // -f "${backupFile}" - faylga saqlash

      // 5. Buyruqni terminalda bajaramiz
      await execPromise(command);
      // execPromise terminal buyrug'ini bajaradi va kutadi
      
      this.logger.log(`Backup muvaffaqiyatli yaratildi: ${backupFile}`);
      
      // 6. Eski backuplarni tozalaymiz (30 kundan eski)
      await this.cleanOldBackups(30);
      
      // 7. Natijani qaytaramiz
      return { success: true, file: backupFile };
      
    } catch (error) {
      // Xatolik bo'lsa, logga yozamiz va throw qilamiz
      this.logger.error('Backup yaratishda xatolik:', error);
      throw error; // Xatolikni yuqoriga uzatamiz
    }
  }

  // ===== JADVALLARNI ALOHIDA BACKUP QILISH =====
  
  async createTableBackups() {
    try {
      // 1. Vaqt belgisi va papka yaratish
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const tablesDir = path.join(this.backupDir, `tables_${timestamp}`);
      // Natija: "backups/tables_2024-11-06T14-30-00/"
      
      // 2. Papka yo'q bo'lsa yaratamiz
      if (!fs.existsSync(tablesDir)) {
        fs.mkdirSync(tablesDir, { recursive: true });
      }

      // 3. Databasedagi barcha jadvallar ro'yxatini olamiz
      const tables = await this.dataSource.query(`
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
      `);
      // pg_tables - PostgreSQL ning system jadvali
      // tablename - jadval nomi
      // schemaname = 'public' - faqat public schema'dagi jadvallar
      
      // Natija masalan: [{tablename: 'users'}, {tablename: 'posts'}, ...]

      // 4. Database ma'lumotlari
      const { host, port, username, password, database } = 
        this.dataSource.options as any;

      // 5. Har bir jadvalni alohida backup qilamiz
      for (const table of tables) {
        const tableName = table.tablename; // Jadval nomi
        const tableFile = path.join(tablesDir, `${tableName}.sql`);
        // Har bir jadval uchun fayl: "tables_xxx/users.sql"

        // 6. Faqat bitta jadvalni backup qilish
        const command = `PGPASSWORD="${password}" pg_dump -h ${host} -p ${port} -U ${username} -d ${database} -t ${tableName} -F p -f "${tableFile}"`;
        // -t ${tableName} - faqat shu jadvalni backup qilish

        await execPromise(command);
        this.logger.log(`Jadval backup qilindi: ${tableName}`);
      }

      this.logger.log(`Barcha jadvallar backup qilindi: ${tablesDir}`);
      return { 
        success: true, 
        directory: tablesDir, 
        tablesCount: tables.length // Nechta jadval backup qilindi
      };
      
    } catch (error) {
      this.logger.error('Jadvallarni backup qilishda xatolik:', error);
      throw error;
    }
  }

  // ===== JSON FORMATDA BACKUP =====
  
  async createJsonBackup(tableName: string) {
    try {
      // 1. Fayl nomi yaratish
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const jsonFile = path.join(this.backupDir, `${tableName}_${timestamp}.json`);
      // Natija: "backups/users_2024-11-06T14-30-00.json"

      // 2. Jadvaldagi BARCHA ma'lumotlarni olamiz
      const data = await this.dataSource.query(`SELECT * FROM ${tableName}`);
      // SELECT * - barcha ustunlar
      // FROM ${tableName} - berilgan jadvaldan
      
      // Natija masalan: 
      // [
      //   {id: 1, name: 'Ali', email: 'ali@mail.uz'},
      //   {id: 2, name: 'Vali', email: 'vali@mail.uz'}
      // ]

      // 3. Ma'lumotlarni JSON formatda faylga yozamiz
      fs.writeFileSync(
        jsonFile, // Fayl yo'li
        JSON.stringify(data, null, 2), // Ma'lumotni JSON ga aylantirish
        // null, 2 - chiroyli formatda (har bir qator yangi qatorda)
        'utf-8' // Encoding
      );

      this.logger.log(`JSON backup yaratildi: ${jsonFile}`);
      return { 
        success: true, 
        file: jsonFile, 
        recordsCount: data.length // Nechta yozuv saqlandi
      };
      
    } catch (error) {
      this.logger.error('JSON backup yaratishda xatolik:', error);
      throw error;
    }
  }

  // ===== INCREMENTAL BACKUP (faqat o'zgargan ma'lumotlar) =====
  
  async createIncrementalBackup() {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFile = path.join(this.backupDir, `incremental_${timestamp}.sql`);

      // MUHIM: Bu faqat MISOL!
      // Siz o'z jadvalingizga moslab o'zgartiring
      
      // So'nggi 6 soat ichida o'zgargan yozuvlarni olamiz
      const query = `
        -- Misol: users jadvali uchun
        SELECT * FROM users 
        WHERE updated_at >= NOW() - INTERVAL '6 hours'
      `;
      
      // TUSHUNTIRISH:
      // updated_at - jadvalingizda oxirgi o'zgarish vaqti ustuni bo'lishi kerak
      // NOW() - hozirgi vaqt
      // INTERVAL '6 hours' - 6 soat orqaga
      // >= - katta yoki teng
      
      // Natija: Faqat oxirgi 6 soatda yangilangan yozuvlar

      // Ma'lumotlarni olamiz
      const data = await this.dataSource.query(query);
      
      // JSON formatda saqlaymiz
      fs.writeFileSync(backupFile, JSON.stringify(data, null, 2));

      this.logger.log(`Incremental backup yaratildi: ${backupFile}`);
      return { success: true, file: backupFile };
      
    } catch (error) {
      this.logger.error('Incremental backup xatolik:', error);
      throw error;
    }
  }

  // ===== ESKI BACKUPLARNI O'CHIRISH =====
  
  async cleanOldBackups(daysToKeep: number) {
    try {
      // 1. Backups papkasidagi barcha fayllarni olamiz
      const files = fs.readdirSync(this.backupDir);
      // readDirSync - papkadagi barcha fayl va papkalar nomini qaytaradi
      // Natija: ['backup_1.sql', 'backup_2.sql', 'tables_xxx', ...]
      
      // 2. Hozirgi vaqt (millisekund)
      const now = Date.now();
      // Date.now() - hozirgi vaqt millisekund formatida
      
      // 3. Maksimal yosh (30 kun = millisekund)
      const maxAge = daysToKeep * 24 * 60 * 60 * 1000;
      // daysToKeep - kunlar soni (masalan: 30)
      // 24 - 1 kunda 24 soat
      // 60 - 1 soatda 60 daqiqa
      // 60 - 1 daqiqada 60 sekund
      // 1000 - 1 sekundda 1000 millisekund

      // 4. Har bir faylni tekshiramiz
      for (const file of files) {
        const filePath = path.join(this.backupDir, file);
        // To'liq fayl yo'li: "backups/backup_1.sql"
        
        const stats = fs.statSync(filePath);
        // statSync - fayl haqida ma'lumot (hajmi, yaratilgan vaqti va h.k.)
        
        // 5. Agar fayl 30 kundan eski bo'lsa, o'chiramiz
        if (now - stats.mtimeMs > maxAge) {
          // stats.mtimeMs - faylning oxirgi o'zgargan vaqti
          // now - stats.mtimeMs - fayl necha millisekund oldin yaratilgan
          // Agar bu raqam maxAge dan katta bo'lsa, fayl eski
          
          fs.unlinkSync(filePath); // Faylni o'chirish
          this.logger.log(`Eski backup o'chirildi: ${file}`);
        }
      }
      
    } catch (error) {
      this.logger.error('Eski backuplarni o\'chirishda xatolik:', error);
    }
  }

  // ===== BACKUPNI TIKLASH (RESTORE) =====
  
  async restoreBackup(backupFilePath: string) {
    try {
      // 1. Database ma'lumotlari
      const { host, port, username, password, database } = 
        this.dataSource.options as any;

      // 2. psql buyrug'i - backupni tiklash
      const command = `PGPASSWORD="${password}" psql -h ${host} -p ${port} -U ${username} -d ${database} -f "${backupFilePath}"`;
      
      // BUYRUQ TUSHUNTIRILISHI:
      // PGPASSWORD="${password}" - parol
      // psql - PostgreSQL client dasturi
      // -h ${host} - server manzili
      // -p ${port} - port
      // -U ${username} - username
      // -d ${database} - database nomi
      // -f "${backupFilePath}" - .sql fayldan o'qish va bajarish
      
      // Bu buyruq backup fayldagi barcha SQL buyruqlarni bajaradi
      // va databaseni oldingi holatiga qaytaradi

      await execPromise(command);
      
      this.logger.log(`Backup tiklandi: ${backupFilePath}`);
      return { success: true, file: backupFilePath };
      
    } catch (error) {
      this.logger.error('Backup tiklashda xatolik:', error);
      throw error;
    }
  }

  // ===== MANUAL BACKUP TRIGGER =====
  
  async triggerManualBackup() {
    // Qo'lda backup ishga tushirish
    this.logger.log('Manual backup boshlandi...');
    
    // To'liq backup
    await this.createFullBackup();
    
    // Jadvallarni alohida backup
    await this.createTableBackups();
  }
}