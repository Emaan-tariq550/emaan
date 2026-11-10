// ============================================================
// YOUR PHOTOGRAPHS
// ------------------------------------------------------------
// 1. Copy your pictures into:  public/images/
// 2. Add/remove/edit entries below. `src` always starts with /images/
//    Example: a file public/images/beach.jpg  ->  src: '/images/beach.jpg'
// 3. orientation: 'portrait' | 'landscape' | 'tall' | 'square'
//    This controls the size of the picture in the masonry layout.
// 4. caption: small text shown under/over the photo (optional).
// ============================================================

const PLACEHOLDER = '/images/placeholder.svg' // shown if a photo is missing

export const gallery = [
  { id: 1,  src: '/images/photo-01.jpg', alt: 'Photo 1',  caption: 'Some moments deserve to stay forever.', orientation: 'portrait' },
  { id: 2,  src: '/images/photo-02.jpg', alt: 'Photo 2',  caption: 'Little things, big memories.',          orientation: 'landscape' },
  { id: 3,  src: '/images/photo-03.jpg', alt: 'Photo 3',  caption: 'Life between the frames.',              orientation: 'tall' },
  { id: 4,  src: '/images/photo-04.jpg', alt: 'Photo 4',  caption: '',                                      orientation: 'square' },
  { id: 5,  src: '/images/photo-05.jpg', alt: 'Photo 5',  caption: '',                                      orientation: 'portrait' },
  { id: 6,  src: '/images/photo-06.jpg', alt: 'Photo 6',  caption: '',                                      orientation: 'landscape' },
  { id: 7,  src: '/images/photo-07.jpg', alt: 'Photo 7',  caption: '',                                      orientation: 'tall' },
  { id: 8,  src: '/images/photo-08.jpg', alt: 'Photo 8',  caption: '',                                      orientation: 'portrait' },
  { id: 9,  src: '/images/photo-09.jpg', alt: 'Photo 9',  caption: '',                                      orientation: 'landscape' },
  { id: 10, src: '/images/photo-10.jpg', alt: 'Photo 10', caption: '',                                      orientation: 'square' },
]

// Photos used for the full-screen hero slideshow (use the `id`s from above).
// Put your best landscape/portrait photos here.
export const slideshowIds = [1, 2, 3, 5, 6]

// Special single photos (swap the file names for your own)
export const specialPhotos = {
  introBackground: '/images/intro.jpg',      // behind the intro text
  heroBackground:  '/images/hero.jpg',       // Chapter 1 main photo
  aboutPortrait:   '/images/about.jpg',      // Chapter 5 portrait
  finalBackground: '/images/final.jpg',      // Final chapter photo
}

export { PLACEHOLDER }