import { Content } from 'pdfmake/interfaces';
import { DateFormatter } from 'src/helpers';

const logo: Content = {
  image: 'src/assets/icases-store-v1.png',
  width: 150,
  height: 150,
  alignment: 'center',
  fit: [80, 80],
  margin: [0, 10, 0, 20],
};

const currentDate: Content = {
  text: DateFormatter.getDDMMMMYYYY(new Date()),
  alignment: 'right',
  margin: [20, 30],
  width: 150,
};

interface HeaderOptions {
  title?: string;
  subTitle?: string;
  showLogo?: boolean;
  showDate?: boolean;
}

export const headerVerticalSection = (options: HeaderOptions): Content => {
  const { title, subTitle, showLogo = true, showDate = true } = options;

  const headerLogo: Content = showLogo ? logo : null;
  const headerDate: Content = showDate ? currentDate : null;

  const headerSubTitle: Content = subTitle
    ? {
        text: subTitle,
        alignment: 'center',
        margin: [0, 2, 0, 0],
        style: {
          fontSize: 16,
          bold: true,
        },
      }
    : null;

  const headerTitle: Content = title
    ? {
        stack: [
          {
            text: title,
            alignment: 'center',
            margin: [0, 15, 0, 0],
            style: {
              bold: true,
              fontSize: 22,
            },
          },
          headerSubTitle,
        ],
      }
    : null;

  return {
    columns: [headerLogo, headerTitle, headerDate],
  };
};
