import * as React from 'react';
import styles from './FixedToolGroup.module.scss'
export interface FixedToolGroupProps {
  style?: React.CSSProperties
}

export default class FixedToolGroup extends React.Component<FixedToolGroupProps, any> {
  public render() {
    return (
      <div className={styles.root} style={this.props.style}>
        {this.props.children}
      </div>
    );
  }
}
