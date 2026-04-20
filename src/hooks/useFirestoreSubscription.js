import { useEffect, useState } from 'react';

export function useFirestoreSubscription(subscribeFn, dependencies = [], initialValue = []) {
  const [data, setData] = useState(initialValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeFn((value) => {
      setData(value);
      setLoading(false);
    });

    return () => unsubscribe?.();
  }, dependencies);

  return { data, loading };
}
