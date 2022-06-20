import type {
  ChartOptions,
  DeepPartial,
  HistogramSeriesOptions,
  LineSeriesOptions,
  AreaStyleOptions,
} from "lightweight-charts";
import { LastPriceAnimationMode, LineStyle } from "lightweight-charts";
import colors from "../../../constants/colors.json";

export const chartOptions: DeepPartial<ChartOptions> = {
  layout: {
    backgroundColor: colors.gray["100"],
    textColor: colors.gray["300"],
    fontSize: 18,
    fontFamily: "Space Grotesk",
  },
  rightPriceScale: {
    visible: false,
  },
  timeScale: {
    borderVisible: false,
    timeVisible: true,
    secondsVisible: false,
  },
  grid: {
    vertLines: {
      visible: false,
    },
    horzLines: {
      style: LineStyle.Dashed,
      color: colors.gray["250"],
    },
  },
  localization: {
    locale: "en-En",
  },
  crosshair: {
    vertLine: {
      labelVisible: false,
    },
    horzLine: {
      visible: false,
    },
  },
};

export const areaOptions: Partial<AreaStyleOptions> = {
  topColor: "rgb(234, 79, 65, 0.15)",
  bottomColor: "rgb(234, 79, 65, 0)",
  lineColor: colors.accent,
  lineWidth: 2,
  crosshairMarkerBorderColor: "#fff",
  lastPriceAnimation: LastPriceAnimationMode.Continuous,
};

export const lineOptions: Partial<LineSeriesOptions> = {
  color: colors.accent,
  crosshairMarkerBorderColor: "#fff",
  lastPriceAnimation: LastPriceAnimationMode.Continuous,
};

export const histogramOptions: Partial<HistogramSeriesOptions> = {
  color: colors.accent,
  base: 0,
};
