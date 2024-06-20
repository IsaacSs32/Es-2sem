import * as fs from 'fs';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';


class SingletonLogger {
    private static instance: SingletonLogger;
    private logFilePath: string = 'app.log';

    
    private constructor() {
        // Certifica-se de que o arquivo de log exista
        if (!fs.existsSync(this.logFilePath)) {
            fs.writeFileSync(this.logFilePath, '');
        }
    }

    
    public static getInstance(): SingletonLogger {
        if (!SingletonLogger.instance) {
            SingletonLogger.instance = new SingletonLogger();
        }
        return SingletonLogger.instance;
    }

    
    private getBrazilTime(): string {
        const timeZone = 'America/Sao_Paulo'; // Fuso horário do Brasil
        const now = new Date();
        const zonedDate = toZonedTime(now, timeZone); // Converte a data atual para o fuso horário do Brasil
        const pattern = 'yyyy-MM-dd HH:mm:ssXXX'; // Formato desejado
        return format(zonedDate, pattern); // Formata a data no fuso horário do Brasil
    }
    
    // Método para escrever mensagens de log no arquivo em formato 
    private writeLog(level: string, message: string): void {
        const logMessage = `${this.getBrazilTime()} - ${level} - ${message}\n`;
        fs.appendFileSync(this.logFilePath, logMessage);
    }

    // Métodos para logging
    public debug(message: string): void {
        this.writeLog('DEBUG', message);
    }

    public info(message: string): void {
        this.writeLog('INFO', message);
    }

    public warn(message: string): void {
        this.writeLog('WARN', message);
    }

    public error(message: string): void {
        this.writeLog('ERROR', message);
    }

    public critical(message: string): void {
        this.writeLog('CRITICAL', message);
    }
}
export{ SingletonLogger }

// Utilização do Singleton Logger
//const logger = SingletonLogger.getInstance();

/*logger.debug('Esta é uma mensagem de debug');
logger.info('Esta é uma mensagem de info');
logger.warn('Esta é uma mensagem de warning');
logger.error('Esta é uma mensagem de error');
logger.critical('Esta é uma mensagem de critical');*/