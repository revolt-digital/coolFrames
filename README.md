## Custom hook for react: useWindowSize

### Install

```yarn add @revolt-digital/cool-frames```

### Styles

You can import the .scss or .css styles

```
@import '~@revolt-digital/cool-frames/lib/styles.scss';
```

### How to use it?

```
import React, { useEffect } from 'react';
import useWindowSize from '@revolt-digital/use-window-size';
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
