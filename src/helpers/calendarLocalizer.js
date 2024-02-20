import {dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay} from 'date-fns';
import it from 'date-fns/locale/it';


const locales = {
  'it': it,
}

export const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});