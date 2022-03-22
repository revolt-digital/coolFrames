import React, { useEffect, useContext, useState, createContext } from 'react';
import useWindowSize from '@revolt-digital/use-window-size';
import useStateRef from '@revolt-digital/use-state-ref';
import WheelIndicator from 'wheel-indicator';
import { makeMatches, makeIndexes } from './helpers';
import Stepper from './stepper';
import { Props, Values, Direction } from './types';

const CoolFramesContext = createContext<Values>({} as Values);

const e: Element | null = typeof window !== 'undefined' ? document.querySelector('#frames') : null;
const DESKTOP_BREAKPOINT = 1024;
const THRESHOLD = 100; // min distance traveled to be considered swipe
let sy: number = 0;
let waiting: any;
let stop = true;

export const useCoolFrames = () => {
  const context = useContext(CoolFramesContext);
  return context;
};

export const CoolFramesProvider = ({ frames: _frames, children }: Props) => {
  const [selectedIndexRef, setSelectedIndex, prevIndex] = useStateRef(0);
  const [translateY, setTranslateY] = useState(0);
  const [lastDirection, setLastDirection] = useState<Direction>();
  const windowSize = useWindowSize();
  const frames = _frames.filter(({ desktop = true }) => (windowSize.width < DESKTOP_BREAKPOINT ? true : desktop));

  const matches = makeMatches(frames);
  const indexes = makeIndexes(frames);

  const prev = () => {
    const nextValue = selectedIndexRef.current - 1;
    setSelectedIndex(nextValue < 0 ? 0 : nextValue);
  };

  const next = () => {
    const limit = frames.reduce((acc, cur) => acc + Math.max(1, cur.sub.length), -1);
    const nextValue = selectedIndexRef.current + 1;
    setSelectedIndex(nextValue > limit ? limit : nextValue);
  };

  const isFrameSelected = (index: number) => {
    const i = selectedIndexRef.current;
    return matches[i] === index;
  };

  const getSubFrameIndex = (frameIndex: number) => {
    if(!isFrameSelected(frameIndex)) {
      return 0;
    }

    const key = indexes[matches[selectedIndexRef.current]];

    if(!Array.isArray(key)) {
      return 0;
    }

    return key.findIndex((v: number) => v === selectedIndexRef.current);
  };

  const wheelIndicator = () => {
    new WheelIndicator({
      elem: e as any,
      callback: ({ direction }) => {
        clearTimeout(waiting);

        waiting = setTimeout(() => {
          waiting = undefined;
          stop = true;
        }, 350);

        if(stop) {
          direction === 'down' ? next() : prev();
          stop = false;
        }
      }
    });
  };

  const handleStartTouch = (e: any) => {
    const { pageY } = e.changedTouches[0];
    sy = pageY;
  };

  const handleEndTouch = (e: any) => {
    const { pageY: dy } = e.changedTouches[0];

    if (Math.abs(dy - sy) >= THRESHOLD) {
      sy > dy ? next() : prev();
    }
  };

  const updateTranslateY = () => {
    const index = matches[selectedIndexRef.current];
    setTranslateY(typeof window !== 'undefined' ? window.innerHeight * index * -1 : 0);
  };

  useEffect(() => {
    setLastDirection(selectedIndexRef.current > prevIndex ? 'down' : 'up');
    updateTranslateY();
  }, [selectedIndexRef.current]);

  useEffect(() => {
    updateTranslateY();
  }, [windowSize]);

  useEffect(() => {
    if(e) {
      if ('ontouchstart' in document.documentElement) {
        e.addEventListener('touchstart', handleStartTouch, { passive: true });
        e.addEventListener('touchend', handleEndTouch, { passive: true });
      } else {
        wheelIndicator();
      }
    }
  }, []);

  return (
    <CoolFramesContext.Provider value={{
      frames,
      prevIndex,
      frameIndex: matches[selectedIndexRef.current],
      selectedIndex: selectedIndexRef.current,
      setSelectedIndex,
      isFrameSelected,
      getSubFrameIndex,
      translateY,
      lastDirection
    }}>
      {children}
    </CoolFramesContext.Provider>
  );
}

export const CoolFrames = () => {
  const { frames, isFrameSelected, getSubFrameIndex, selectedIndex, setSelectedIndex, translateY, lastDirection } = useCoolFrames();

  const frameProps = (index: number, sub: string[], extraProps = {}) => {
    const subFrames = sub.length + 1;
    const aux = [];

    for(let i=0; i<subFrames; i++) {
      aux.push(index + i);
    }

    // Mark as selected the first frame and the subFrame
    return {
      key: index,
      lastDirection,
      selected: isFrameSelected(index),
      subFrame: getSubFrameIndex(index),
      extraProps
    };
  };

  return (
    <>
      <Stepper frames={frames} selectedIndex={selectedIndex} setFrame={setSelectedIndex} />

      <div id="frames" className="frames" style={{ transform: `translate3d(0, ${translateY}px, 0)` }}>
        <div>
          {frames.map(({ Component, sub, extraProps }, index) => (
            <Component {...frameProps(index, sub, extraProps)} />
          ))}
        </div>
      </div>
    </>
  );
};
