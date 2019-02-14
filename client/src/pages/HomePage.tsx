import * as React from 'react'
import styles from './HomePage.module.scss'
import { Switch, Route, withRouter, RouteComponentProps } from 'react-router-dom'
import { MenuList, MenuItem, ListItemIcon, ListItemText, IconButton, Avatar, Input, InputAdornment } from '@material-ui/core'
import { EventNoteRounded, Public, StarBorderRounded, AddRounded, CancelRounded, SaveRounded, AccountCircleOutlined, SettingsRounded, SettingsOutlined, Apps, Search } from '@material-ui/icons'
import MarkdownEditor from '../components/markdown/MarkdownEditor';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import NotesPage from './notes/NotesPage';
import FixedToolGroup from '../components/toolgroup/FixedToolGroup';
import NoteDetail from './notes/NoteDetail';
import LoginDialog from './LoginDialog';
import { deepOrange } from '@material-ui/core/colors';
import client from '../apollo/client';

const MENUS = ['Notes', 'Browser', 'Starred']
const MENU_ICONS = [<EventNoteRounded />, <Public />, <StarBorderRounded />]
export interface HomePageProps {
}
const CREATE_MARKDOWN = gql`
  mutation createMarkdown($title: String, $content: String) {
    markdown(title: $title, content: $content) {
      id
    }
  }
`
class HomePage extends React.Component<HomePageProps & RouteComponentProps<{}>, any> {
  private md: MarkdownEditor | null = null
  state = {
    activeMenuIndex: 0,
    showMarkdownEditor: false,
    md: '',
    showLoginDialog: false
  }
  private renderMenu = () => {
    return (
      <MenuList className={styles.menu}>
        {MENUS.map((menuText, index) => (
          <MenuItem 
            className={`${styles.menuItem} ${this.state.activeMenuIndex === index && styles.active}`}
            onClick={() => {
              this.setState({ activeMenuIndex: index })
              this.props.history.push(`/${menuText.toLocaleLowerCase()}`)
            }}
            key={menuText}
          >
            <ListItemIcon className={styles.icon}>
              {MENU_ICONS[index]}
            </ListItemIcon>
            <ListItemText className={styles.text} inset primary={menuText} />
          </MenuItem>
        ))}
      </MenuList>
    )
  }
  private renderExternalToolGroup = () => {
    return (
      <FixedToolGroup>
        {this.state.showMarkdownEditor ? (
          <React.Fragment>
            <IconButton color="primary" aria-label="Cancel" onClick={() => this.setState({ showMarkdownEditor: false })} >
              <CancelRounded />
            </IconButton>
            <Mutation
              mutation={CREATE_MARKDOWN}
              onCompleted={() => this.setState({ showMarkdownEditor: false, md: '' })}
            >
              {(create) => (
                <IconButton color="primary" aria-label="Save" onClick={() => create({ variables: this.md ? this.md.getTextInfo() : ({}) })} >
                  <SaveRounded />
                </IconButton>
              )}
            </Mutation>
          </React.Fragment>
        ) : (
          <IconButton color="default" aria-label="Add" onClick={() => this.setState({ showMarkdownEditor: true })} >
            <AddRounded />
          </IconButton>
        )}
      </FixedToolGroup>
    )
  }
  private renderMarkdown = () => {
    return (
      <div className={styles.markdownWrapper}>
        <MarkdownEditor 
          value={this.state.md} 
          onChange={md => this.setState({ md })} ref={el => this.md = el}
          onEscape={() => this.setState({ showMarkdownEditor: false })}
        />
      </div>
    )
  }
  private renderContent = () => {
    return (
      <Switch>
        <Route path="/notes" exact><NotesPage /></Route>
        <Route path="/notes/:id" exact><NoteDetail /></Route>
      </Switch>
    )
  }
  public render() {
    return (
      <div className={styles.root}>
        <div className={styles.header}>
          <div className={styles.logo}><span style={{ background: deepOrange[500] }}>N</span><span>otes</span></div>
          <div className={styles.searchBar}>
            <Input
              className={styles.input}
              fullWidth
              placeholder="Search"
              startAdornment={(
                <InputAdornment position="start" style={{ padding: '0 8px' }}>
                  <Search style={{ fill: 'rgba(0,0,0,0.12)' }}/>
                </InputAdornment>
              )}
            />
          </div>
          <div className={styles.toolGroup}>
            <Query
              query={gql`
                query user {
                  user {
                    id
                    username
                  }
                }
              `}
            >
              {({ data }) => data.user && data.user.id ? (
                <React.Fragment>
                  <IconButton color="default">
                    <SettingsRounded />
                  </IconButton>
                  <IconButton color="default">
                    <Apps />
                  </IconButton>
                  <Avatar style={{ background: deepOrange[500] }}>{data.user.username.slice(0,1).toUpperCase()}</Avatar>
                </React.Fragment>
              ) : (
                <IconButton color="default" onClick={() => this.setState({ showLoginDialog: true })}>
                  <AccountCircleOutlined />
                </IconButton>
              )}
            </Query>
          </div>
        </div>
        <div className={styles.body}>
          <div className={styles.side}>
            {this.renderMenu()}
          </div>
          <div className={styles.content}>
            {this.renderContent()}
          </div>
        </div>
        {this.renderExternalToolGroup()}
        {this.state.showMarkdownEditor && this.renderMarkdown()}
        <LoginDialog 
          open={this.state.showLoginDialog}
          onClose={() => this.setState({ showLoginDialog: false })}
        />
      </div>
    );
  }
}

export default withRouter(HomePage)