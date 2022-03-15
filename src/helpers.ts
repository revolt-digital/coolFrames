import { Frame } from './types';

export function makeMatches(frames: Frame[]): number[] {
  const matches: number[] = [];

  for(const { sub } of frames) {
    const next = matches.length === 0 ? 0 : matches[matches.length - 1] + 1;

    if(sub.length === 0) {
      matches.push(next);
    } else {
      for(let i=0; i<sub.length; i++) {
        matches.push(next);
      }
    }
  }

  return matches;
}

export function makeIndexes(frames: Frame[]): any[] {
  const aux: any[] = [];
  let next = 0;
  let i = 0;

  while(frames[i]) {
    const { sub } = frames[i];
    let j = 0;

    if(sub.length === 0) {
      aux.push(next);
      next++;
    } else {
      const index = aux.push([]);

      while(sub[j]) {
        aux[index-1].push(next);
        j++;
        next++;
      }
    }

    i++;
  }

  return aux;
}
