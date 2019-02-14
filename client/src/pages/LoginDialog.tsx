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
import client from '../apollo/client';

export interface LoginDialogProps {
  onClose: () => void
  open: boolean
}

export default class LoginDialog extends React.Component<LoginDialogProps, any> {
  state = {
    username: '',
    password: ''
  }
  private onChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => this.setState({ [key]: e.target.value })
  public render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.onClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Login</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To visit Notes for your own, login by username and password.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="username"
            type="text"
            fullWidth
            onChange={this.onChange('username')}
          />
          <TextField
            margin="dense"
            label="password"
            type="password"
            fullWidth
            onChange={this.onChange('password')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onClose} color="primary">
            Cancel
          </Button>
          <Mutation
            mutation={gql`
              mutation login($username:String!, $password: String!) {
                login(username: $username, password: $password) {
                  id
                }
              }
            `}
            onCompleted={(data) => {
              localStorage.setItem('uid', data.login.id)
              location.reload()
              this.props.onClose()
              client.writeQuery({
                query: gql`
                  query user {
                    user {
                      id
                    }
                  }
                `,
                data: {
                  user: data.login
                }
              })
            }}
          >
            {(mutate) => (
              <Button onClick={() => mutate({ variables: this.state })} color="primary">
                Login
              </Button>
            )}
          </Mutation>

        </DialogActions>
      </Dialog>
    );
  }
}
