import { UserAgentInfo, UserAgentUtils } from './user-agent-utils';

describe('User agent utils', () => {
  test('Empty', () => {
    const expected: UserAgentInfo = { browser: null, device: null };
    expect(UserAgentUtils.getUserAgentInfo(undefined)).toEqual(expected);
    expect(UserAgentUtils.getUserAgentInfo(null)).toEqual(expected);
    expect(UserAgentUtils.getUserAgentInfo('')).toEqual(expected);
  });

  test('Desktop Windows 10 Chrome', () => {
    const userAgent =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) ' +
      'Chrome/135.0.0.0 Safari/537.36';

    const expected: UserAgentInfo = { browser: 'Chrome', device: 'Windows 10' };
    expect(UserAgentUtils.getUserAgentInfo(userAgent)).toEqual(expected);
  });

  test('Desktop Window 10 Edge', () => {
    const userAgent =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) ' +
      'Chrome/134.0.0.0 Safari/537.36 Edg/134.0.0.0';

    const expected: UserAgentInfo = { browser: 'Edge', device: 'Windows 10' };
    expect(UserAgentUtils.getUserAgentInfo(userAgent)).toEqual(expected);
  });

  test('Desktop Ubuntu Firefox', () => {
    const userAgent = 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:15.0) Gecko/20100101 Firefox/15.0.1';
    const expected: UserAgentInfo = { browser: 'Firefox', device: 'Ubuntu' };
    expect(UserAgentUtils.getUserAgentInfo(userAgent)).toEqual(expected);
  });

  test('Unknown OS Chrome', () => {
    const userAgent = 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36';
    const expected: UserAgentInfo = { browser: 'Chrome', device: null };
    expect(UserAgentUtils.getUserAgentInfo(userAgent)).toEqual(expected);
  });

  test('Windows 7 Unknown browser', () => {
    const userAgent = 'Mozilla/5.0 (Windows NT 6.1; Win64; x64)';
    const expected: UserAgentInfo = { browser: null, device: 'Windows 7' };
    expect(UserAgentUtils.getUserAgentInfo(userAgent)).toEqual(expected);
  });

  test('Samsung Galaxy S10 Chrome', () => {
    const userAgent =
      'Mozilla/5.0 (Linux; Android 12; SM-G973U) AppleWebKit/537.36 (KHTML, like Gecko) ' +
      'Chrome/112.0.0.0 Mobile Safari/537.36';

    const expected: UserAgentInfo = { browser: 'Mobile Chrome', device: 'Samsung Android 12' };
    expect(UserAgentUtils.getUserAgentInfo(userAgent)).toEqual(expected);
  });

  test('Google Pixel 6 Chrome', () => {
    const userAgent =
      'Mozilla/5.0 (Linux; Android 13; Pixel 6) AppleWebKit/537.36 (KHTML, like Gecko) ' +
      'Chrome/112.0.0.0 Mobile Safari/537.36';

    const expected: UserAgentInfo = { browser: 'Mobile Chrome', device: 'Google Android 13' };
    expect(UserAgentUtils.getUserAgentInfo(userAgent)).toEqual(expected);
  });

  test('Apple iPhone 16 Pro Max', () => {
    const userAgent =
      'Mozilla/5.0 (iPhone17,2; CPU iPhone OS 18_3_1 like Mac OS X) AppleWebKit/605.1.15 ' +
      '(KHTML, like Gecko) Mobile/15E148 Resorts/4.5.2';

    const expected: UserAgentInfo = { browser: 'WebKit', device: 'Apple iOS 18.3.1' };
    expect(UserAgentUtils.getUserAgentInfo(userAgent)).toEqual(expected);
  });
});
