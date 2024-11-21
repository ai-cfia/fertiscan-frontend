class LogService {
  private channel: BroadcastChannel;

  constructor() {
    this.channel = new BroadcastChannel("drawer_channel");
  }

  log(type: string, message: any[], originalMethod: (...args: any[]) => void) {
    const msg = message
      .map((m) => (typeof m === "string" ? m : JSON.stringify(m, null, 2)))
      .join(" ");
    this.channel.postMessage({ type, msg });
    originalMethod.apply(console, message);
  }

  overrideConsoleMethods() {
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;
    const originalInfo = console.info;

    console.log = (...args: any[]) => this.log("log", args, originalLog);
    console.warn = (...args: any[]) => this.log("warn", args, originalWarn);
    console.error = (...args: any[]) => this.log("error", args, originalError);
    console.info = (...args: any[]) => this.log("info", args, originalInfo);
  }
}

const logService = new LogService();
export default logService;
