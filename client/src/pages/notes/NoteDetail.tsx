import * as React from 'react';
import styles from './NoteDetail.module.scss'
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';
import MarkdownEditor from '../../components/markdown/MarkdownEditor';
import { withRouter, RouteComponentProps } from 'react-router';
import FixedToolGroup from '../../components/toolgroup/FixedToolGroup';
import { IconButton } from '@material-ui/core';
import { CancelRounded, SaveRounded, EditRounded } from '@material-ui/icons';

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
  state = {
    isEdit: false,
    editContent: null as string | null
  }
  md : MarkdownEditor | null = null
  public render() {
    return (
      <div className={styles.root}>
        <Query
          query={MARKDOWN}
          variables={{
            id: this.props.match.params.id
          }}
        >
          {({ data, refetch }) => data && data.markdown ? (
            <React.Fragment>
              <MarkdownEditor 
                readOnly={!this.state.isEdit} 
                value={this.state.isEdit ? this.state.editContent : data.markdown.content}
                onChange={editContent => this.setState({ editContent })}
                ref={el => this.md = el}
              />
              <FixedToolGroup style={{ zIndex: 36 }}>
                {this.state.isEdit ? (
                  <React.Fragment>
                    <IconButton color="default" aria-label="Cancel" onClick={() => this.setState({ isEdit: false })} >
                      <CancelRounded />
                    </IconButton>
                    <Mutation
                      mutation={gql`
                        mutation md($id:ID, $title:String, $content:String) {
                          markdown(id:$id, title:$title, content:$content) {
                            id
                            title
                            content
                          }
                        }
                      `}
                      onCompleted={() => {
                        this.setState({ isEdit: false, editContent: null })
                        // refetch()
                      }}
                    >
                      {(mutate) => (
                        <IconButton 
                          color="default" 
                          aria-label="Save" 
                          onClick={() => mutate({ variables: this.md ? {...this.md.getTextInfo(), id: this.props.match.params.id } : ({}) })}
                        >
                          <SaveRounded />
                        </IconButton>
                      )}
                    </Mutation>
                  </React.Fragment>
                ) : (
                  <IconButton color="default" aria-label="Edit" onClick={() => this.setState({ isEdit: true, editContent: data.markdown.content })} >
                    <EditRounded />
                  </IconButton>
                )}
              </FixedToolGroup>
            </React.Fragment>
          ) : null}
        </Query>
      </div>
    );
  }
}
export default withRouter(NoteDetail)