import { readFileSync } from 'fs';
import { ZodiacSign } from '../interfaces/zodiac-sign.interface';

export const getHoroscope = (stringDate: string): string => {
  const days = [20, 19, 21, 20, 21, 22, 23, 23, 23, 24, 22, 22];
  const signs = [
    'Aquarius',
    'Pisces',
    'Aries',
    'Taurus',
    'Gemini',
    'Cancer',
    'Leo',
    'Virgo',
    'Libra',
    'Scorpio',
    'Sagittarius',
    'Capricorn',
  ];
  const date = new Date(stringDate);
  let month = date.getMonth();
  const day = date.getDate();
  if (month === 0 && day <= 19) {
    month = 11;
  } else if (day < days[month]) {
    month--;
  }

  return signs[month];
};

export const getZodiac = (stringDate: string): string => {
  let basePath = __dirname.replace('dist/global/helpers', '');
  basePath = basePath.replace('src/global/helpers', '');
  const source = readFileSync(
    basePath + '/src/global/sources/chinese-zodiac.txt',
  ).toString('utf8');

  const splitSigns = source.split(/\n/);
  const zodiacSigns: ZodiacSign[] = splitSigns.reduce(
    (signs: ZodiacSign[], txt: string) => {
      const splitTxt = txt.split(' ');
      const startDate = `${splitTxt[0]}-${splitTxt[1]}-${splitTxt[2]}`;
      const endDate = `${splitTxt[3]}-${splitTxt[4]}-${splitTxt[5]}`;
      const sign = splitTxt[6];

      signs.push({
        startDate: startDate,
        endDate: endDate,
        sign: sign,
      });

      return signs;
    },
    [],
  );

  const target = toTimeStamp(stringDate);
  return zodiacSigns.find(
    (x) =>
      target >= toTimeStamp(x.startDate) && target <= toTimeStamp(x.endDate),
  )?.sign;
};

export const toTimeStamp = (stringDate: string): number => {
  return Math.floor(new Date(stringDate).getTime() / 1000);
};

export const getZodiacSimplified = (stringDate: string): string => {
  const date = new Date(stringDate);
  const year = date.getFullYear();
  switch (year % 12) {
    case 0:
      return 'Monkey';
    case 1:
      return 'Rooster';
    case 2:
      return 'Dog';
    case 3:
      return 'Boar';
    case 4:
      return 'Rat';
    case 5:
      return 'Ox';
    case 6:
      return 'Tiger';
    case 7:
      return 'Rabbit';
    case 8:
      return 'Dragon';
    case 9:
      return 'Snake';
    case 10:
      return 'Horse';
    case 11:
      return 'Sheep';
  }
};
