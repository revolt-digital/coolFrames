import React, { useEffect, useContext, useState, useRef, createContext } from 'react';
import useWindowSize from '@revolt-digital/use-window-size';
import { makeMatches, makeIndexes } from './helpers';
import { Frame } from './types';

const DESKTOP_BREAKPOINT = 1024;
const THRESHOLD = 100; // min distance traveled to be considered swipe
let idle = true;
let wheeling:any;
let sy: number = 0;

type Values = {
  frames: Frame[];
  selectedIndex: number;
  frameIndex: number;
  setSelectedIndex: (index: number) => void;
  isFrameSelected: (index: number) => void;
  getSubFrameIndex: (index: number) => void;
  translateY: number;
}

const CoolFramesContext = createContext<Values>({} as Values);

export const useCoolFrames = () => {
  const context = useContext(CoolFramesContext);
  return context;
};

export const CoolFramesProvider = ({ frames: _frames, children }: { frames: Frame[], children: React.ReactNode }) => {
  const [selectedIndex, _setSelectedIndex] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const windowSize = useWindowSize();
  const stateRef = useRef(selectedIndex);
  const frames = _frames.filter(({ desktop = true }) => (windowSize.width < DESKTOP_BREAKPOINT ? true : desktop));

  const matches = makeMatches(frames);
  const indexes = makeIndexes(frames);

  const setSelectedIndex = (index: number) => {
    stateRef.current = index;
    _setSelectedIndex(index);
  };

  const prev = () => {
    const nextValue = stateRef.current - 1;
    setSelectedIndex(nextValue < 0 ? 0 : nextValue);
  };

  const next = () => {
    const limit = frames.reduce((acc, cur) => acc + Math.max(1, cur.sub.length), -1);
    console.log({ limit });
    const nextValue = stateRef.current + 1;
    setSelectedIndex(nextValue > limit ? limit : nextValue);
  };

  const isFrameSelected = (index: number) => {
    const i = stateRef.current;
    return matches[i] === index;
  };

  const getSubFrameIndex = (frameIndex: number) => {
    if(!isFrameSelected(frameIndex)) {
      return 0;
    }

    const key = indexes[matches[stateRef.current]];

    if(!Array.isArray(key)) {
      return 0;
    }

    return key.findIndex((v: number) => v === selectedIndex);
  };

  const handleWheel = (e: any) => {
    clearTimeout(wheeling);

    console.log(e.deltaY);

    wheeling = setTimeout(() => {
      wheeling = undefined;
      idle = true;
    }, 250);

    if(idle) {
      e.deltaY > 0 ? next() : prev();
      idle = false;
    }
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
    const index = matches[stateRef.current];
    setTranslateY(typeof window !== 'undefined' ? window.innerHeight * index * -1 : 0);
  };

  useEffect(() => {
    updateTranslateY();
  }, [stateRef.current]);

  useEffect(() => {
    updateTranslateY();
  }, [windowSize]);

  useEffect(() => {
    const e = document.querySelector('#frames');

    if(e) {
      if ('ontouchstart' in document.documentElement) {
        e.addEventListener('touchstart', handleStartTouch, { passive: true });
        e.addEventListener('touchend', handleEndTouch, { passive: true });
      } else {
        e.addEventListener('wheel', handleWheel);
      }
    }
  }, []);

  return (
    <CoolFramesContext.Provider value={{
      frames,
      frameIndex: matches[stateRef.current],
      selectedIndex: stateRef.current,
      setSelectedIndex,
      isFrameSelected,
      getSubFrameIndex,
      translateY
    }}>
      {children}
    </CoolFramesContext.Provider>
  );
}