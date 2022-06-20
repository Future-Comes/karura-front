import React from "react";
import type { MouseEventParams, SingleValueData } from "lightweight-charts";
import { createChart } from "lightweight-charts";
import { chartOptions, histogramOptions } from "../chart.options";

interface Props {
  data: SingleValueData[];
  onChangePoint: (params: MouseEventParams) => void;
}

const HistogramChart: React.FC<Props> = React.memo(
  ({ data, onChangePoint }) => {
    const chartContainerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      const el = chartContainerRef.current;

      if (!el) {
        return;
      }

      const chart = createChart(chartContainerRef.current, {
        ...chartOptions,
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
      });

      chart.timeScale().fitContent();

      chart.subscribeCrosshairMove(onChangePoint);

      const newSeries = chart.addHistogramSeries(histogramOptions);
      newSeries.setData(data);

      const handleResize = () => {
        chart.applyOptions({ width: el.clientWidth });
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);

        chart.remove();
      };
    }, [chartContainerRef, onChangePoint]);

    return <div className="min-h-64 h-full" ref={chartContainerRef} />;
  }
);

export default HistogramChart;
