import * as React from 'react';
import styles from './NoteDetail.module.scss'
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import MarkdownEditor from '../../components/markdown/MarkdownEditor';
import { withRouter, RouteComponentProps } from 'react-router';

const MARKDOWN = gql`
  query md($id: ID) {
    markdown(id: $id) {
      id
      title
      content
    }
  }
`

export interface NoteDetailProps {
}

class NoteDetail extends React.Component<NoteDetailProps & RouteComponentProps<{ id: string}>, any> {
  public render() {
    return (
      <div>
        <Query
          query={MARKDOWN}
          variables={{
            id: this.props.match.params.id
          }}
        >
          {({ data }) => data && data.markdown ? (
            <MarkdownEditor readOnly value={data.markdown.content} />
          ) : null}
        </Query>
      </div>
    );
  }
}
export default withRouter(NoteDetail)