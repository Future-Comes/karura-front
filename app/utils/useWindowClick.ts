import React from "react";

export const useWindowClick = (cb: () => void) => {
  React.useEffect(() => {
    window.addEventListener("click", cb);

    return () => window.removeEventListener("click", cb);
  }, [cb]);
};
