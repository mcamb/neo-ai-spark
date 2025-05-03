
import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { ChartContainer } from "./chart-container"
import { ChartTooltipContent } from "./chart-tooltip-content"
import { ChartLegendContent } from "./chart-legend-content"
import { ChartStyle } from "./chart-style"
import { ChartConfig } from "./types"

const ChartTooltip = RechartsPrimitive.Tooltip
const ChartLegend = RechartsPrimitive.Legend

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  type ChartConfig,
}
