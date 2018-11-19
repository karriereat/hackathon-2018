import { h, Component } from 'preact';

import { User } from '../interfaces';

export default class Users extends Component<{ users: User[] }, any> {
  render({ users }: { users: User[] }) {
    return (
      <div class="users">
        {users.map(user => <span class="user">{user.name}</span>)}
      </div>
    );
  }
}
