import { DateUtils } from '../utils';

export const mockDate = (fakeDateString: string) => {
  return jest.spyOn(DateUtils, 'now').mockReturnValue(new Date(fakeDateString));
};
