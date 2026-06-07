import { useState } from 'react';
export const usePrevious = (value) => {
    const [state, setState] = useState({
        value,
        prev: undefined,
    });
    if (state.value !== value) {
        setState({ value, prev: state.value });
    }
    return state.prev;
};
