
import { useState } from "react";

export const useAuthRetry = () => {
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRY_ATTEMPTS = 3;
  const RETRY_DELAY = 1000;

  const shouldRetry = (currentRetryCount: number) => {
    return currentRetryCount < MAX_RETRY_ATTEMPTS;
  };

  const getRetryDelay = (attempt: number) => {
    return RETRY_DELAY * (attempt + 1);
  };

  return {
    retryCount,
    setRetryCount,
    shouldRetry,
    getRetryDelay,
    MAX_RETRY_ATTEMPTS,
  };
};
