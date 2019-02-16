import * as React from 'react';
import styles from './HeaderBar.module.scss'
export interface HeaderBarProps {
}

export default class HeaderBar extends React.Component<HeaderBarProps, any> {
  public render() {
    return (
      <div className={styles.root}>
        {this.props.children}
      </div>
    );
  }
}
