import React from "react";
import clsx from "clsx";

interface Props {
  className?: string;
}

export const AutoSlider: React.FC<Props> = ({ children, className }) => {
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (wrapperRef.current) {
      const interval = setInterval(() => {
        window.requestAnimationFrame(() => {
          if (wrapperRef.current) {
            wrapperRef.current.scrollLeft += 1;
          }
        });
      }, 40);

      return () => clearInterval(interval);
    }
  }, [wrapperRef.current]);

  return (
    <div
      ref={wrapperRef}
      className={clsx(
        className,
        "scroll scroll-auto overflow-x-scroll overscroll-none hover:scroll-auto"
      )}
    >
      <div className="flex">{children}</div>
    </div>
  );
};
