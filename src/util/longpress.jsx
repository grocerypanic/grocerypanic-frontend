import { useState, useEffect, useCallback } from "react";

export default function UseLongPress(
  longPressCallBack = () => {},
  shortPressCallBack = () => {},
  ms = 300
) {
  const [startLongPress, setStartLongPress] = useState(false);
  const [startShortPress, setShortPress] = useState(false);

  useEffect(() => {
    let timerId;

    if (startShortPress[1]) shortPressCallBack(startShortPress[0]);
    if (startLongPress[1])
      timerId = setTimeout(() => longPressCallBack(startLongPress[0]), ms);

    return () => {
      clearTimeout(timerId);
    };
  }, [
    longPressCallBack,
    shortPressCallBack,
    ms,
    startShortPress,
    startLongPress,
  ]);

  const start = useCallback((e) => {
    setStartLongPress([e, true]);
    setShortPress([e, true]);
  }, []);
  const stop = useCallback((e) => {
    setStartLongPress([e, false]);
    setShortPress([e, false]);
  }, []);

  return {
    onMouseDown: (e) => start(e),
    onMouseUp: (e) => stop(e),
    onMouseLeave: (e) => stop(e),
    onTouchStart: (e) => start(e),
    onTouchEnd: (e) => stop(e),
  };
}
