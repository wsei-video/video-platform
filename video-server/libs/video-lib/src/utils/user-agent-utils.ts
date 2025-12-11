import { UAParser } from 'ua-parser-js';

export class UserAgentUtils {
  public static getUserAgentInfo(userAgent?: string | null): UserAgentInfo {
    if (!userAgent) return { browser: null, device: null };
    const parser = new UAParser();
    parser.setUA(userAgent);
    const result = parser.getResult();
    return { browser: result.browser.name ?? null, device: this.getDeviceFromResult(result) };
  }

  private static getDeviceFromResult(result: UAParser.IResult): string | null {
    const deviceBuilder = [];
    if (result.device.vendor) deviceBuilder.push(result.device.vendor);
    if (result.os.name) deviceBuilder.push(result.os.name);
    if (result.os.version) deviceBuilder.push(result.os.version);
    return deviceBuilder.length ? deviceBuilder.join(' ') : null;
  }
}

export type UserAgentInfo = { browser: string | null; device: string | null };
