# Cut of Four <img src="assets/pixel-camera.png" height="34" alt="Pink pixel camera" />

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

A cute photobooth that lives in your browser.

Take webcam photos, pick a pretty frame, add words and stickers, then save the final picture.

## How to use it

1. Click the curtain that says **enter →**
2. Allow camera access when your browser asks
3. Pick a filter and a frame
4. Click **take a photo!** and pose
5. Add words and stickers
6. Click **download this frame ♡** to save it

## Fun things to try

• Retake just one photo in the strip if you blinked

• Drag stickers around and make them bigger or smaller

• Deleted a photo by accident? Press the undo button

• Your photos never leave your browser unless you download and share them

***

## For Developers

Run it locally:

```bash
npm install
npm run dev
```

Then open http://localhost:5173

Build it:

```bash
npm run build
```

### Built with

• React and TypeScript

• Vite

• Tailwind CSS

• Google Fonts: Caveat, Gaegu, and Cormorant Garamond

### Where things live

• `src/App.tsx` controls the cover page and the booth

• `src/components` has the camera screen, the frames, and the stickers

• `src/data` has the filters, frames, and sticker lists

• `src/hooks` has the webcam logic

• `src/utils` has the PNG download helper

• `public` has the pink pixel cursors
