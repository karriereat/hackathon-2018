import { h, Component } from 'preact';
import { provider, users, backup } from '../firebase';
import * as firebase from 'firebase';

import { User } from '../interfaces';

import johannesImage from '../johannes.jpg';

export default class Header extends Component<{}, { user: User }> {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
    };

    firebase.auth().onAuthStateChanged((user) => {
      this.setState({ user: user || {} });
    });
  }

  login() {
    firebase.auth().signInWithPopup(provider).then(result => {
      const docRef = users.doc(result.user.uid);

      docRef.get().then((doc) => {
        if (doc.exists) {
          docRef.update({ signed: true })
        } else {
          docRef.set({ signed: true });
        }
      });
    });
  }

  logout() {
    const docRef = users.doc(firebase.auth().currentUser.uid);

    docRef.get().then((doc) => {
      if (doc.exists) {
        docRef.update({ signed: false });
      }
    });

    firebase.auth().signOut();
  }

  render() {
    return (
      <header class="header">
        <img class="header__image" src={johannesImage}/>
        <h1 class="header__title">Johannes</h1>
        <button type="button" class="header__button start-presentation">
          Start Presentation
        </button>
        <button type="button" className="header__button" onClick={backup} style={{flexGrow: 0}}>
          JSON
        </button>
        <div class="header__auth">
          {!this.state.user.displayName ? (
            <button
              type="button"
              class="header__button sign-in"
              onClick={this.login}
            >
              Login
            </button>
          ) : (
            <button
              type="button"
              class="header__button sign-out"
              style={{ backgroundImage: `url(${this.state.user.photoURL})` }}
              onClick={this.logout}
            />
          )}
        </div>
      </header>
    );
  }
}
