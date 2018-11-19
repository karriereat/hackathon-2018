let presentation: boolean;
let currentSlide: number;
let $slides: NodeListOf<Element>;
let $progress: HTMLElement;

const KEY_LEFT = 'ArrowLeft';
const KEY_RIGHT = 'ArrowRight';
const KEY_ESC = 'Escape';
const CLASS = 'slide--presented';

function nextSlide() {
  $slides[currentSlide].classList.remove(CLASS);
  currentSlide++;
  if (currentSlide >= $slides.length) {
    currentSlide = 0;
  }
  $slides[currentSlide].classList.add(CLASS);
}

function previousSlide() {
  $slides[currentSlide].classList.remove(CLASS);
  currentSlide--;
  if (currentSlide < 0) {
    currentSlide = $slides.length - 1;
  }
  $slides[currentSlide].classList.add(CLASS);
}

function updateProgress() {
  $progress.classList.remove('is-hidden');
  $progress.style.width = `${ (currentSlide + 1) / $slides.length * 100 }%`;
}

function resetProgress() {
  $progress.classList.add('is-hidden');
  $progress.removeAttribute('style');
}

document.addEventListener('keydown', (event) => {
  if (!presentation) {
    return;
  }
  if (event.code === KEY_LEFT) {
    previousSlide();
    updateProgress();
  }
  if (event.code === KEY_RIGHT) {
    nextSlide();
    updateProgress();
  }
  if (event.code === KEY_ESC) {
    endPresentation();
  }
});

export function startPresentation(_$slides: NodeListOf<Element>, _$progress: HTMLElement) {
  presentation = true;
  currentSlide = 0;
  $slides = _$slides;
  $progress = _$progress;

  $slides[currentSlide].classList.add(CLASS);
  updateProgress();

  // @ts-ignore
  document.documentElement.webkitRequestFullscreen();
  // @ts-ignore
  document.documentElement.mozRequestFullScreen();
  // @ts-ignore
  document.documentElement.msRequestFullscreen();
  document.documentElement.requestFullscreen();
}

function endPresentation() {
  presentation = false;

  $slides[currentSlide].classList.remove(CLASS);
  resetProgress();

  // @ts-ignore
  document.webkitExitFullscreen();
  // @ts-ignore
  document.mozCancelFullScreen();
  // @ts-ignore
  document.msExitFullscreen();
  document.exitFullscreen();
}
