import * as React from 'react';
import styles from './MarkdownEditor.module.scss'
import CodeMirror from 'react-codemirror'
import MarkdownViewer from 'react-markdown'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'

export interface MarkdownEditorProps {
  value: string,
  onChange?: (value: string) => void
  onEscape?: () => void
  readOnly?: boolean
}

export default class MarkdownEditor extends React.Component<MarkdownEditorProps, any> {
  private viewer: HTMLDivElement | null = null
  static defaultProps = {
    readOnly: false
  }
  componentDidMount() {
    window.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        if (this.props.onEscape) {
          this.props.onEscape()
        }
      }
    })
  }
  public getTextInfo = () => {
    if (this.viewer == null) { return {} }
    const text = this.viewer.innerText
    const splits = text.split(/\n/)
    return {
      text: splits.slice(1).join(' '),
      title: splits[0],
      content: this.props.value
    }
  }
  public render() {
    return (
      <div className={`${styles.root} ${this.props.readOnly ? styles.readOnly : ''}`}>
        {!this.props.readOnly && 
          <CodeMirror value={this.props.value} onChange={this.props.onChange} options={{ theme: 'material' }}/>
        }
        <div className={styles.viewer} ref={viewer => this.viewer = viewer}>
          <MarkdownViewer source={this.props.value} skipHtml={true} />
        </div>
      </div>
    );
  }
}
