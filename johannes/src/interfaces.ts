export enum ImageSlot {
  RIGHT,
  CENTER,
  FULL
}

export interface Slide {
  id?: string;
  title?: string;
  titleEditor?: string;
  text?: string;
  textEditor?: string;
  imageUrl?: string;
  imageSlot?: ImageSlot;
  createdAt?: number;
}

export interface Image {
  url: string,
  top: number,
  left: number,
  width: number,
  height: number
}

export interface User {
  name?: string,
  displayName?: string,
  photoURL?: string,
}
