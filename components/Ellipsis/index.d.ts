import * as React from "react";
export interface EllipsisProps {
  tooltip?: boolean;
  length?: number;
  lines?: number;
  style?: React.CSSProperties;
}

export default class Ellipsis extends React.Component<
  EllipsisProps,
  any
> {}
