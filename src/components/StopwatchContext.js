import React, { createContext } from "react";
import useStopwatch from "../hooks/useStopwatch";

export const StopwatchContext = createContext();

// This context provider is passed to any component requiring the context
export const StopwatchProvider = ({ children }) => {
  const [
    time,
    getCurrentTime,
    pauseTimer,
    startTimer,
    resetTimer,
    disableTimer,
  ] = useStopwatch();

  return (
    <StopwatchContext.Provider
      value={{
        time,
        getCurrentTime,
        pauseTimer,
        startTimer,
        resetTimer,
        disableTimer,
      }}
    >
      {children}
    </StopwatchContext.Provider>
  );
};
