## Custom hook for react: useWindowSize

### Install

```yarn add @revolt-digital/cool-frames```

### How to use it?

```
import React, { useEffect } from 'react';
import { CoolFramesProvider } from '@revolt-digital/cool-frames';
import CoolFrames from '@revolt-digital/cool-frames/component';

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
    ...
    
    useEffect(() => {
        const vh = window.innerHeight * .01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }, []);

    return (
        <CoolFramesProvider frames={frames}>
            ...
            <CoolFrames />
        </CoolFramesProvider>
    );
};
```
