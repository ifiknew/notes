import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import NoteItem from '../notes/NoteItem';
import styles from './FoldersPage.module.scss'
import { IconButton, Menu, MenuItem } from '@material-ui/core';
import { CreateNewFolderOutlined, FolderOutlined, AddRounded } from '@material-ui/icons';
import FolderDialog from './dialog/FolderDialog';
import HeaderBar from '../../components/headerbar/HeaderBar';

export interface FoldersPageProps {
}
class FoldersPage extends React.Component<FoldersPageProps & RouteComponentProps<{}>, any> {
  state = {
    paths: [],
    showFolderDialog: false,
    anchorFolderElement: null as HTMLElement | null,
    anchorFolderId: null as string | null
  }
  static getDerivedStateFromProps = (nextProps: FoldersPageProps & RouteComponentProps<{}>) => {
    const { search } = nextProps.location
    let paths: Array<string> = []
    if (search) {
      const pathsStr = (/path=[^&]*/.exec(search) || [''])[0].replace('path=', '')
      if (pathsStr) {
        paths = pathsStr.split('/')
      }
    }
    return {
      paths
    }
  }

  public render() {
    const { paths } = this.state
    const currentFolderId = paths.length ? paths[paths.length - 1] : null
    return (
      <Query
        query={gql`
          query folder($id:ID) {
            folder(id:$id) {
              id
              folders {
                id
                name
              }
              markdowns {
                id
                title
                text
                updateTime
              }
            }
          }
        `}
        variables={{
          id: currentFolderId
        }}
      >
        {({ data, loading, refetch: refetchCurrentFolder }) => data && data.folder ? (
          <div className={styles.root}>
            <HeaderBar>
              <div />
              <div>
                <IconButton onClick={() => this.setState({ showFolderDialog: true })}>
                  <CreateNewFolderOutlined color="primary"/>
                </IconButton>
                <Mutation
                  mutation={gql`
                    mutation createMarkdown($folderId: ID) {
                      markdown(title: "Write your title", content: "# Write your title", text: "To be Continued...", folderId: $folderId) {
                        id
                      }
                    }
                  `}
                  variables={{
                    folderId: currentFolderId
                  }}
                  refetchQueries={[{
                    query: gql`
                      query mds {
                        markdowns {
                          id
                        }
                      }
                    `,
                  }, {
                    query: gql`
                      query folder($id: ID) {
                        folder(id:$id) {
                          id
                          markdowns {
                            id
                            title
                            text
                            updateTime
                          }
                        }
                      }
                    `,
                    variables: {
                      id: currentFolderId
                    }
                  }]}
                >
                  {(mutate) => (
                    <IconButton onClick={() => mutate()}>
                      <AddRounded color="primary"/>
                    </IconButton>
                  )}
                </Mutation>
              </div>
            </HeaderBar>
            <div className={styles.label}>FOLDERS</div>
            <div className={styles.folderGroup}>
              <Menu
                anchorEl={this.state.anchorFolderElement}
                open={Boolean(this.state.anchorFolderElement)}
                onClose={() => this.setState({ anchorFolderElement: null })}
              >
                <Mutation
                  mutation={gql`
                    mutation deleteDir($id: ID) {
                      folder(id: $id) {
                        id
                      }
                    }
                  `}
                  refetchQueries={[{
                    query: gql`
                      query folder($id: ID) {
                        folder(id:$id) {
                          id
                          folders {
                            id
                          }
                        }
                      }
                    `,
                    variables: {
                      id: currentFolderId
                    }
                  }]}
                  onCompleted={() => {
                    this.setState({
                      anchorFolderElement: null,
                      anchorFolderId: null
                    })
                  }}
                >
                  {(mutate) => <MenuItem onClick={() => mutate({ variables: { id: this.state.anchorFolderId } })}>Delete</MenuItem>}
                </Mutation>
              </Menu>
              {data.folder.folders.map((folder: any) => (
                <div 
                  className={styles.folder} 
                  key={folder.id} 
                  onClick={() => {
                    if (currentFolderId) {
                      this.props.history.push(`${this.props.location.pathname}${this.props.location.search}/${folder.id}`)
                    } else {
                      this.props.history.push(`/folders?path=${folder.id}`)
                    }
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault()
                    this.setState({
                      anchorFolderElement: e.target,
                      anchorFolderId: folder.id
                    })
                  }}
                >
                  <IconButton>
                    <FolderOutlined fontSize="large" />
                  </IconButton>
                  <div className={styles.text}>{folder.name}</div>
                </div>
              ))}
              <div className={styles.folder}>
                <div className={styles.text} style={{ color: 'transparent' }}>Create</div>
              </div>
            </div>
            <div className={styles.label}>FILES</div>
            {data.folder.markdowns.map((md: any) => (
              <NoteItem 
                key={md.id}
                md={md}
                onClick={() => this.props.history.push(`/folders/notes/${md.id}`)}
              />
            ))}
            <FolderDialog 
              open={this.state.showFolderDialog}
              onClose={() => this.setState({ showFolderDialog: false })}
              contextId={currentFolderId}
            />
          </div>
        ) : null}
      </Query>
    );
  }
}
export default withRouter(FoldersPage)