import React from 'react';
import classnames from 'classnames';
import { makeMatches, makeIndexes } from './helpers';
import { Frame } from './types';

type Props = {
  frames: Frame[];
  selectedIndex: number;
  setFrame: (position: number) => void;
};

export default ({ frames, selectedIndex, setFrame }: Props) => {
  const matches = makeMatches(frames);
  const indexes = makeIndexes(frames);

  return (
    <div className="stepper">
      {frames.map(({ label, sub }, index) => (
        <React.Fragment key={index}>
          {sub.length === 0 || matches[selectedIndex] !== index ? (
            <button
              className={classnames('line', { selected: selectedIndex === indexes[index] })}
              onClick={() => setFrame(sub.length === 0 ? indexes[index] : indexes[index][0])}
              data-label={label}
            />
          ) : <></>}
          {sub.length > 0 && matches[selectedIndex] === index && sub.map((item: any, subIndex: number) => (
            <button
              key={subIndex}
              className={classnames('circle', { selected: selectedIndex === indexes[index][subIndex] })}
              onClick={() => setFrame(indexes[index][subIndex])}
              data-label={item}
            />
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};
