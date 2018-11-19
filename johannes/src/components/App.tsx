import { h, Component } from 'preact';

import { slideshow, users } from '../firebase';
import { Slide, User } from '../interfaces';

import Footer from './Footer';
import Header from './Header';
import Slides from './Slides';
import Users from './Users';

export default class App extends Component<{}, { slides: Slide[], users: User[] }> {
  constructor(props) {
    super(props);

    this.state = {
      slides: [],
      users: [],
    };

    slideshow.collection('slides').orderBy('createdAt', 'asc').onSnapshot((doc) => {
      const slidesArray: Slide[] = [];
      doc.docs.forEach((el) => {
        slidesArray.push({
          id: el.id,
          ...el.data()
        })
      });

      this.setState({ slides: slidesArray });
    });

    users.onSnapshot((userData) => {
      const userArray: User[] = [];
      userData.forEach(x => userArray.push(x.data()));
      this.setState({ users: userArray.filter(x => x.name) });
    });
  }

  addSlide() {
    slideshow.collection('slides').doc().set({ title: 'Title', text: 'Text', createdAt: new Date().getTime() }, { merge: true });
  }

  render() {
    return (
      <div id="app">
        <Header/>
        <Users users={this.state.users}/>
        <Slides slides={this.state.slides}/>
        <button
          class="add-new"
          type="button"
          onClick={() => this.addSlide()}
          >
          Add Slide
        </button>

        <Footer/>
      </div>
    );
  }
}
