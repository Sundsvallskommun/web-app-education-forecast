import { KeyStringTable, Pupil } from '@interfaces/forecast/forecast';

/**
 *
 * @param query Query string from e.g. an input
 * @param filterFunc Filter function that checks object and returns true or false
 * @returns boolean
 */
export const searchFilter =
  (query: string, filterFunc: (query: string, obj: KeyStringTable | Pupil) => boolean) =>
  (obj: KeyStringTable | Pupil) => {
    if (!query) return true;
    const qList = query.split(',');
    const qResultList: boolean[] = [];
    qList.forEach((_query) => {
      const q = _query.toLowerCase().trim();
      qResultList.push(filterFunc(q, obj));
    });
    return qResultList.every((x) => x === true);
  };
