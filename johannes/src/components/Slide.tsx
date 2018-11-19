import { h, Component } from 'preact';
import * as firebase from 'firebase';

import { slideshow, db } from '../firebase';

import { Slide as SlideInterface, Image as ImageInterface } from '../interfaces';

import Image from './Image';
import SlideField from './SlideField';

export default class Slide extends Component<{ data: any, index: string }, any> {
  constructor(props) {
    super(props);

    this.state = {
      editorName: firebase.auth().currentUser ? firebase.auth().currentUser.displayName : null,
      index: props.index,
      text: {
        isProcessed: false,
      },
      title: {
        isProcessed: false,
      }
    };
  }

  lockField({ name }) {
    this.setState({
      [name]: {
        isProcessed: true,
      },
    });

    const slide: SlideInterface = {
      [`${name}Editor`]: this.state.editorName,
    };

    slideshow.collection('slides').doc(this.props.index).set(slide, { merge: true });
  }

  unlockField({ name }) {
    this.setState({
      [name]: {
        isProcessed: false,
      },
    });

    const slide: SlideInterface = {
      [`${name}Editor`]: null,
    };
    slideshow.collection('slides').doc(this.props.index).set(slide, { merge: true });
  }

  updateField({ name, value }) {
    const slide: SlideInterface = {
      [name]: value.trim(),
    };
    slideshow.collection('slides').doc(this.props.index).set(slide, { merge: true });
  }

  render({ data: { title, titleEditor, text, textEditor } }) {
    return (
      <li class="slide">
        <div class="slide__inside">
          {this.props.data.imageUrl ? <Image
            onClick={() => this.toggleImageSlot()}
            src={this.props.data.imageUrl}
            slot={this.props.data.imageSlot || 0}
          /> : ''}
          <SlideField
            editor={titleEditor}
            name={'title'}
            locked={titleEditor && titleEditor !== this.state.editorName}
            isProcessed={this.state.title.isProcessed}
            value={title}
            onFocus={() => this.lockField({ name: 'title' })}
            onBlur={() => this.unlockField({ name: 'title' })}
            onKeyUp={e => this.updateField({ name: 'title', value: e.target.innerHTML })}
          />
          <SlideField
            editor={textEditor}
            name={'text'}
            locked={textEditor && textEditor !== this.state.editorName}
            isProcessed={this.state.text.isProcessed}
            value={text}
            onFocus={() => this.lockField({ name: 'text' })}
            onBlur={() => this.unlockField({ name: 'text' })}
            onKeyUp={e => this.updateField({ name: 'text', value: e.target.innerHTML })}
          />
          <div class="slide__toolbox">
            <button type="button" class="slide__toolboxButton slide__addImage" onClick={() => this.addImage()}>🖼</button>
            <button type="button" class="slide__toolboxButton slide__moveUp" onClick={(event) => this.move(-1, event)}>⬆️</button>
            <button type="button" class="slide__toolboxButton slide__moveDown" onClick={(event) => this.move(1, event)}>⬇️</button>
            <button type="button" class="slide__toolboxButton slide__deleteSlide" onClick={() => this.remove()}>❌</button>
          </div>
        </div>
      </li>
    );
  }

  addImage() {
    const url = window.prompt('Image URL?');
    // const url = 'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif';
    const slide: SlideInterface = {
      imageUrl: url,
    };
    slideshow.collection('slides').doc(this.props.index).set(slide, { merge: true });
  }

  toggleImageSlot() {
    let slot = this.props.data.imageSlot || 0;
    slot++;
    if (slot > 2) {
      slot = 0;
    }
    const slide: SlideInterface = {
      imageSlot: slot,
    };
    slideshow.collection('slides').doc(this.props.index).set(slide, { merge: true });
  }

  move(direction: -1 | 1, event) {
    event.currentTarget.blur();

    const slide = slideshow.collection('slides').doc(this.props.index).get();
    const slides = slideshow.collection('slides').orderBy('createdAt', 'asc').get();

    Promise.all([slide, slides]).then(([doc, { docs }]) => {
      const oldOrder = {};
      docs.forEach((el, index) => {
        oldOrder[el.id] = (index + 1) * 10;
        const isEqual = el.isEqual(doc);
        if (isEqual) {
          oldOrder[el.id] = oldOrder[el.id] + 15 * direction;
        }
      });

      let newOrder = {};
      Object.entries(oldOrder).forEach(([id, order]) => {
        newOrder[order] = id;
      });
      newOrder = Object.values(newOrder);

      const batch = db.batch();
      newOrder.forEach((id, index) => {
        const slide:SlideInterface = {
          // TODO Use a separate `order` field, instead of cannibalizing `createdAt`.
          createdAt: index
        };
        const docRef = slideshow.collection('slides').doc(id);
        batch.set(docRef, slide, { merge: true });
      });
      batch.commit();
    });
  }

  remove() {
    slideshow.collection('slides').doc(this.props.index).delete();
  }
}
