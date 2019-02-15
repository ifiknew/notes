import * as React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import styles from './NotesPage.module.scss'
import { withRouter, RouteComponentProps } from 'react-router';
import NoteItem from './NoteItem';

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

class NotesPage extends React.Component<NotesPageProps & RouteComponentProps<{}>, any> {
  public render() {
    return (
      <MarkdownQuery
        query={MARKDOWN_LIST}
      >
        {({ data, loading }) => (data && data.markdowns) ? 
          <div className={styles.root}>
            {data.markdowns.map(md => (
              <NoteItem 
                md={md}
                key={md.id}
                onClick={() => this.props.history.push(`/notes/${md.id}`)}
              />
            ))}
          </div>
        : null}
      </MarkdownQuery>
    );
  }
}
export default withRouter(NotesPage)