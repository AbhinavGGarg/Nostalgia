"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type CountdownOptions = {
  expiresAt?: string;
  onExpire?: () => void;
  active?: boolean;
};

export const useCountdown = ({ expiresAt, onExpire, active = true }: CountdownOptions) => {
  const [nowTick, setNowTick] = useState(() => Date.now());
  const expiredRef = useRef(false);
  const expiresMs = expiresAt ? new Date(expiresAt).getTime() : null;

  useEffect(() => {
    expiredRef.current = false;
  }, [expiresAt, active]);

  useEffect(() => {
    if (!expiresMs || !active) {
      expiredRef.current = false;
      return;
    }
    const interval = window.setInterval(() => setNowTick(Date.now()), 100);
    return () => window.clearInterval(interval);
  }, [active, expiresMs]);

  const remainingMs = active && expiresMs ? Math.max(0, expiresMs - nowTick) : 0;

  useEffect(() => {
    if (!active || !expiresMs || remainingMs !== 0 || expiredRef.current) {
      return;
    }
    expiredRef.current = true;
    onExpire?.();
  }, [active, expiresMs, onExpire, remainingMs]);

  const formatted = useMemo(() => {
    const seconds = Math.ceil(remainingMs / 1000);
    const whole = Math.max(0, seconds);
    const mins = Math.floor(whole / 60)
      .toString()
      .padStart(2, "0");
    const secs = (whole % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  }, [remainingMs]);

  return {
    remainingMs,
    remainingSeconds: Math.ceil(remainingMs / 1000),
    formatted,
    isExpired: remainingMs <= 0,
  };
};
