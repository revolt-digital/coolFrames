import React from 'react';
import { useCoolFrames } from './';
import Stepper from './stepper';

export default () => {
  const { frames, isFrameSelected, getSubFrameIndex, selectedIndex, setSelectedIndex, translateY } = useCoolFrames();

  const frameProps = (index: number, sub: string[], extraProps = {}) => {
    const subFrames = sub.length + 1;
    const aux = [];

    for(let i=0; i<subFrames; i++) {
      aux.push(index + i);
    }

    // Mark as selected the first frame and the subFrame
    return {
      key: index,
      selected: isFrameSelected(index),
      subFrame: getSubFrameIndex(index),
      extraProps
    };
  };

  return (
    <>
      <Stepper frames={frames} selectedIndex={selectedIndex} setFrame={setSelectedIndex} />

      <div id="frames" className="frames" style={{ transform: `translateY(${translateY}px)` }}>
        <div>
          {frames.map(({ Component, sub, extraProps }, index) => (
            <Component {...frameProps(index, sub, extraProps)} />
          ))}
        </div>
      </div>
    </>
  );
};
