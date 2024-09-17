export class Logger {
  public static create() {
    return new Logger();
  }

  private constructor() {}

  public info(message: string, details?: any) {
    const text = `**INFO** ${message}`;
    if (details) {
      console.log(text, details);
      return;
    }
    console.log(text);
  }

  public error(message: string, details?: any) {
    const text = `**ERRO** ${message}`;
    if (details) {
      console.error(text, details);
      return;
    }
    console.error(text);
  }
}
