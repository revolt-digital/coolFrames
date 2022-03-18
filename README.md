## Custom hook for react: useWindowSize

### Install

```
yarn add @revolt-digital/use-state-ref
yarn add @revolt-digital/cool-frames
```

### Styles

You can import the .scss or .css styles

```
@import '~@revolt-digital/cool-frames/lib/styles.scss';
```

### How to use it?

```
import React, { useEffect } from 'react';
import useWindowSize from '@revolt-digital/use-window-size';
import { CoolFramesProvider, CoolFrames } from '@revolt-digital/cool-frames';

const frames = [
    {
        label: 'Intro',
        sub: [],
        Component: Intro
    },
    {
        label: 'Trio',
        sub: [],
        Component: ExtendedDescription,
        desktop: false
    },
    {
        label: 'How does it work?',
        sub: ['SignUp', 'Upload', 'Discover'],
        Component: HowWorks
    },
]; 

export default () => {
    const windowSize = useWindowSize();
    ...
    
    useEffect(() => {
        const vh = window.innerHeight * .01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }, [windowSize.height]);

    return (
        <CoolFramesProvider frames={frames}>
            ...
            <CoolFrames />
        </CoolFramesProvider>
    );
};
```

### Options

| Name | Type | Description |
| :---: | :---: | :---: |
| frames | Frame[] | Array of frames. A frame represents a single view in a determined position. Params: label, subs (subFrames), Component, desktop (true by default) and extraProps (if it were needed). |

### Hook

| Name | Type | Description |
| :---: | :---: | :---: |
| frames | Frame[] |  |
| selectedIndex | number | Index in the stepper. |
| prevIndex | number | It is the previous index selected. |
| frameIndex | number | I represent the subframe index. It will be 0 when there isn't subrames for the frame. |
| setSelectedIndex | (index: number) => void; |  |
| isFrameSelected | (index: number) => void; |  |
| getSubFrameIndex | (index: number) => void; |  |
| translateY | number |  |
| lastDirection | Direction | It can be 'up, 'down' or undefined. |
