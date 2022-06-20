import { Suspense, useEffect, useState } from "react";
import type { ReactNode, ReactChild, FC } from "react";

interface Props {
  children: ReactNode;
  fallback: ReactChild;
}

export const ClientSuspense: FC<Props> = ({ children, fallback }) => {
  let [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? (
    <Suspense fallback={fallback}>{children}</Suspense>
  ) : (
    <>{fallback}</>
  );
};
