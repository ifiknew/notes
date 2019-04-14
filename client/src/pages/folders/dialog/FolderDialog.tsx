import * as React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';


export interface FolderDialogProps {
  onClose: () => void
  open: boolean,
  contextId?: string | null
}

export default class FolderDialog extends React.Component<FolderDialogProps, any> {
  state = {
    name: '',
  }
  private onChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => this.setState({ [key]: e.target.value })
  public render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.onClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Folder</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Create a folder with name
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="name"
            type="text"
            fullWidth
            onChange={this.onChange('name')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onClose} color="default">
            Cancel
          </Button>
          <Mutation
            mutation={gql`
              mutation folder($name:String!, $parentId: ID) {
                folder(name: $name, parentId: $parentId) {
                  id
                  parentId
                }
              }
            `}
            onCompleted={() => {
              this.props.onClose()
            }}
            refetchQueries={[{
              query: gql`
                query folder($id:ID) {
                  folder(id:$id) {
                    id
                    folders {
                      id
                      name
                    }
                  }
                }
              `,
              variables: {
                id: this.props.contextId
              }
            }]}
          >
            {(mutate) => (
              <Button onClick={() => mutate({ variables: {...this.state, parentId: this.props.contextId  } })} color="primary">
                Create
              </Button>
            )}
          </Mutation>

        </DialogActions>
      </Dialog>
    );
  }
}
