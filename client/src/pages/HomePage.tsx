import * as React from 'react'
import styles from './HomePage.module.scss'
import { MenuList, MenuItem, ListItemIcon, ListItemText, IconButton } from '@material-ui/core'
import { EventNoteRounded, Public, StarBorderRounded, AddRounded } from '@material-ui/icons'
import MarkdownEditor from '../components/markdown/MarkdownEditor';

const MENUS = ['Notes', 'Browser', 'Starred']
const MENU_ICONS = [<EventNoteRounded />, <Public />, <StarBorderRounded />]
export interface HomePageProps {
}
export default class HomePage extends React.Component<HomePageProps, any> {
  state = {
    activeMenuIndex: 0,
    showMarkdownEditor: false,
    md: '123'
  }
  componentDidMount() {
    window.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        this.setState({ showMarkdownEditor: false })
      }
    })
  }
  private renderCreate = () => {
    return (
      <div className={styles.createWrapper}>
        <IconButton color="default" aria-label="Add" onClick={() => this.setState({ showMarkdownEditor: true })} >
          <AddRounded />
        </IconButton>
      </div>
    )
  }
  private renderMenu = () => {
    return (
      <MenuList className={styles.menu}>
        {MENUS.map((menuText, index) => (
          <MenuItem 
            className={`${styles.menuItem} ${this.state.activeMenuIndex === index && styles.active}`}
            onClick={() => this.setState({ activeMenuIndex: index })}
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
  private renderMarkdown = () => {
    return (
      <div className={styles.markdownWrapper}>
        <MarkdownEditor value={this.state.md} onChange={md => this.setState({ md })}/>
      </div>
    )
  }
  public render() {
    return (
      <div className={styles.root}>
        <div className={styles.header}>
          <div className={styles.logo}><span>N</span><span>otes</span></div>
          <div className={styles.searchBar}>
            {/* <Search />
            <Input placeholder="search"/> */}
          </div>
          <div className={styles.toolGroup}></div>
        </div>
        <div className={styles.body}>
          <div className={styles.side}>
            {this.renderCreate()}
            {this.renderMenu()}
          </div>
          <div className={styles.content}></div>
        </div>
        {this.state.showMarkdownEditor && this.renderMarkdown()}
      </div>
    );
  }
}