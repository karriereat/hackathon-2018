import { h, Component } from 'preact';

import { ImageSlot } from '../interfaces';

export default class Image extends Component<{ slot: ImageSlot, src: String, onClick?: any }, {}> {
  render() {
    let image;
    if (this.props.slot === ImageSlot.RIGHT) {
      image = {
        top: 5,
        left: 50,
        width: 45,
        height: 90
      };
    }
    if (this.props.slot === ImageSlot.CENTER) {
      image = {
        top: 30,
        left: 5,
        width: 90,
        height: 60
      };
    }
    if (this.props.slot === ImageSlot.FULL) {
      image = {
        top: 0,
        left: 0,
        width: 100,
        height: 100
      };
    }
    return (
      <div class="image"
           title="Click to toggle image position (right, center, full)"
           style={{
             position: 'absolute',
             top: `${image.top}%`,
             left: `${image.left}%`,
             width: `${image.width}%`,
             height: `${image.height}%`,
             backgroundSize: this.props.slot === ImageSlot.FULL ? 'cover' : 'contain',
             backgroundImage: `url(${this.props.src})`,
             backgroundRepeat: 'no-repeat',
             backgroundPosition: 'center',
           }}
           onClick={this.props.onClick}
      />
    );
  }
}
