import React from 'react';

export type Frame = {
  label: string;
  sub: string[];
  Component: any;
  desktop?: boolean;
  extraProps?: any;
}

export type Direction = 'up' | 'down' | undefined;

export type Values = {
  frames: Frame[];
  selectedIndex: number;
  frameIndex: number;
  setSelectedIndex: (index: number) => void;
  isFrameSelected: (index: number) => void;
  getSubFrameIndex: (index: number) => void;
  translateY: number;
  lastDirection: Direction;
  prevIndex?: number;
}

export type Props = {
  frames: Frame[],
  children: React.ReactNode
};
