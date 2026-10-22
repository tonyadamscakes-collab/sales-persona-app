import { useCallback, useEffect, useState } from "react";

type LoadState<T> = {
  status: "loading" | "ready" | "error";
  data: T | null;
  error: string | null;
};

export function useLoad<T>(loader: () => Promise<T>) {
  const [state, setState] = useState<LoadState<T>>({ status: "loading", data: null, error: null });
  const [tick, setTick] = useState(0);

  const reload = useCallback(() => {
    setState((current) => ({ status: "loading", data: current.data, error: null }));
    setTick((value) => value + 1);
  }, []);

  const replace = useCallback((data: T) => {
    setState({ status: "ready", data, error: null });
  }, []);

  useEffect(() => {
    let cancelled = false;
    loader().then(
      (data) => {
        if (!cancelled) setState({ status: "ready", data, error: null });
      },
      (error: unknown) => {
        if (!cancelled) {
          setState((current) => ({
            status: "error",
            data: current.data,
            error: error instanceof Error ? error.message : "Something went wrong.",
          }));
        }
      },
    );
    return () => {
      cancelled = true;
    };
  }, [loader, tick]);

  return {
    ...state,
    reload,
    replace,
    loading: state.status === "loading" && state.data === null,
  };
}
