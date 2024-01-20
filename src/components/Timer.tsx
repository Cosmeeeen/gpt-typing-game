import * as React from 'react';

interface TimerProps {
  startTime: number | undefined;
  endTime: number | undefined;
  running: boolean;
}

const Timer: React.FC<TimerProps> = ({ startTime, endTime, running }) => {
  const [time, setTime] = React.useState<number>(0);

  React.useEffect(() => {
    if (!running || !startTime) {
      setTime(0);
      return;
    }
    if (!running && endTime) {
      setTime(endTime - startTime);
      return;
    }

    const interval = setInterval(() => {
      setTime(Date.now() - startTime);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [startTime, endTime, running]);

  const renderTime = React.useCallback(() => {
    const seconds = Math.floor(time / 1000 % 60);
    const minutes = Math.floor(time / 1000 / 60);
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  }, [time]);

  if (!running && !endTime) return null;
  return (
    <span>{renderTime()}</span>
  );
};

export default Timer;
