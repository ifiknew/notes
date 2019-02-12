import * as React from 'react';
import styles from './MarkdownEditor.module.scss'
import CodeMirror from 'react-codemirror'
import MarkdownViewer from 'react-markdown'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'

export interface MarkdownEditorProps {
  value: string,
  onChange: (value: string) => void
}

export default class MarkdownEditor extends React.Component<MarkdownEditorProps, any> {
  public render() {
    return (
      <div className={styles.root}>
        <CodeMirror value={this.props.value} onChange={this.props.onChange} options={{ theme: 'material' }}/>
        <div className={styles.viewer}>
          <MarkdownViewer source={this.props.value} skipHtml={true} />
        </div>
      </div>
    );
  }
}
