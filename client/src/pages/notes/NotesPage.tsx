import * as React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import styles from './NotesPage.module.scss'

const MARKDOWN_LIST = gql`
  query mds {
    markdowns {
      id
      title
      content
    }
  }
`

export interface NotesPageProps {
}
class MarkdownQuery extends Query<{ markdowns: { id: string, title: string, content: string }[] }> {}
export default class NotesPage extends React.Component<NotesPageProps, any> {
  public render() {
    return (
      <MarkdownQuery
        query={MARKDOWN_LIST}
      >
        {({ data, loading }) => (data && data.markdowns) ? 
          <div className={styles.root}>
            {data.markdowns.map(md => (
              <div className={styles.note} style={{color: 'rgba(0,0,0,.32)'}} key={md.id}>
                <span className={styles.content}>
                  <span style={{ fontWeight: 500, color: 'rgba(0,0,0,.87)' }}>{md.title}</span>
                  <span style={{ padding: '0 4px', color: 'rgba(0,0,0,.32)' }}>—</span>
                  <span style={{ color: 'rgba(0,0,0,.32)' }}>{md.content}</span>
                </span>
                <span className={styles.time} style={{ color: 'rgba(0,0,0,.87)' }}>00:45 PM</span>
              </div>
            ))}
          </div>
        : null}
      </MarkdownQuery>
    );
  }
}
