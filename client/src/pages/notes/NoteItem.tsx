import * as React from 'react';
import styles from './NoteItem.module.scss'
export interface NoteItemProps {
  md: any
  onClick: () => void
}

export default class NoteItem extends React.Component<NoteItemProps, any> {
  public render() {
    const { md } = this.props
    return (
      <div 
        className={styles.root} 
        style={{color: 'rgba(0,0,0,.32)'}} 
        key={md.id}
        onClick={this.props.onClick}
      >
        <span className={styles.content}>
          <span style={{ fontWeight: 500, color: 'rgba(0,0,0,.87)' }}>{md.title}</span>
          <span style={{ padding: '0 4px', color: 'rgba(0,0,0,.32)' }}>—</span>
          <span style={{ color: 'rgba(0,0,0,.32)' }}>{md.content}</span>
        </span>
        <span className={styles.time} style={{ color: 'rgba(0,0,0,.87)' }}>00:45 PM</span>
      </div>
    );
  }
}
