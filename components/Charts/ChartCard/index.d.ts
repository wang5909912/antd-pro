import * as React from "react";
export interface ChartCardProps {
  title: React.ReactNode;
  action?: React.ReactNode;
  total?: React.ReactNode | number;
  footer?: React.ReactNode;
  gutter?: number;
  avatar?: React.ReactNode;
  style?: React.CSSProperties;
}

export default class ChartCard extends React.Component<ChartCardProps, any> {}
