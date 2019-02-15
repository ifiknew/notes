import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import NoteItem from '../notes/NoteItem';
import styles from './FoldersPage.module.scss'
import { IconButton } from '@material-ui/core';
import { CreateNewFolderRounded, CreateNewFolderOutlined, FolderOutlined, AddRounded } from '@material-ui/icons';
import FolderDialog from './dialog/FolderDialog';
import { deepOrange } from '@material-ui/core/colors';
export interface FoldersPageProps {
}
class FoldersPage extends React.Component<FoldersPageProps & RouteComponentProps<{}>, any> {
  state = {
    paths: [],
    showFolderDialog: false
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
              folders {
                id
                name
              }
              markdowns {
                id
                title
                content
              }
            }
          }
        `}
        variables={{
          id: currentFolderId
        }}
      >
        {({ data, loading }) => data && data.folder ? (
          <div className={styles.root}>
            <div className={styles.headerBar}>
              <IconButton >
                <AddRounded color="primary" style={{ fill: deepOrange[500] }}/>
              </IconButton>
            </div>
            <div className={styles.label}>FOLDERS</div>
            <div className={styles.folderGroup}>
              {data.folder.folders.map((folder: any) => (
                <div 
                  className={styles.folder} 
                  key={folder.id} 
                  onClick={() => {
                    if (currentFolderId) {
                      this.props.history.push(`${this.props.location.pathname}?${this.props.location.search}/${folder.id}`)
                    } else {
                      this.props.history.push(`/folders?path=${folder.id}`)
                    }
                  }}>
                  <IconButton>
                    <FolderOutlined fontSize="large" />
                  </IconButton>
                  <div className={styles.text}>{folder.name}</div>
                </div>
              ))}
              <div className={styles.folder}>
                <IconButton onClick={() => this.setState({ showFolderDialog: true })}>
                  <CreateNewFolderOutlined fontSize="large" />
                </IconButton>
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