import { useEffect, useRef } from "react";
import { Accelerometer, AccelerometerMeasurement } from "expo-sensors";

type Props = {
  onShake: () => void;
  enabled: boolean;
};

const SHAKE_THRESHOLD = 1.55;
const COOLDOWN_MS = 1200;

const getMagnitude = ({ x, y, z }: AccelerometerMeasurement): number => Math.sqrt(x * x + y * y + z * z);

export const useShakeToCrack = ({ onShake, enabled }: Props): void => {
  const lastShakeRef = useRef(0);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    Accelerometer.setUpdateInterval(120);
    const subscription = Accelerometer.addListener((data) => {
      const magnitude = getMagnitude(data);
      const adjusted = Math.abs(magnitude - 1);
      const now = Date.now();

      if (adjusted > SHAKE_THRESHOLD && now - lastShakeRef.current > COOLDOWN_MS) {
        lastShakeRef.current = now;
        onShake();
      }
    });

    return () => subscription.remove();
  }, [onShake, enabled]);
};
