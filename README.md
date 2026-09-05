# 🎂 Happy Birthdayy Chittu — Personalization Guide

This guide tells you exactly where to put your photos and how to customize every piece of text.

---

## 📸 Adding Photos

### Step 1 — Create the photos folder

Inside the `public/` directory, create a folder called `photos`:

```
public/
  photos/
    hero.jpg          ← Chittu's main photo (shown in the cinematic intro)
    memory-01.jpg     ← Year 1 memory
    memory-02.jpg     ← Year 2 memory
    memory-03.jpg
    ...
    memory-27.jpg     ← Year 27 memory
```

### Step 2 — Add your photos

Copy your photos into `public/photos/` using the exact filenames above.

- **hero.jpg** — A beautiful portrait of Chittu. Works best as a vertical or square photo. The website will crop it to fill the full screen.
- **memory-01.jpg through memory-27.jpg** — One photo per year. Any size works — they're displayed as square polaroids.

### Tips for best results

| Photo type | Recommended |
|---|---|
| Hero photo | Portrait, vertical, high quality |
| Memory photos | Square or landscape, any quality |
| File format | JPG or PNG (JPG recommended for smaller file size) |
| Max file size | Keep each under 2MB for fast loading |

### What happens if a photo is missing?

If a photo file is not found, the website shows a stylized placeholder with the filename. The rest of the site works perfectly — you can add photos one at a time.

---

## 🎵 Adding Background Music

Create a `music/` folder inside `public/` and add a file named `birthday.mp3`:

```
public/
  music/
    birthday.mp3
```

The music player button (bottom-right corner) will then work. Music plays on loop and is user-controlled — it does **not** autoplay.

---

## ✏️ Customizing Text

All text is in **`src/data/content.ts`**. Open that file and edit:

| Section | What you can change |
|---|---|
| `HERO` | Name, age, title, taglines, button text |
| `LETTER` | The birthday letter — full message, salutation, closing, signature |
| `TREE` | Section heading and subheading |
| `BOND` | The brother-sister bond section text |
| `ADVICE` | Heading + each advice line (add/remove lines freely) |
| `FINAL` | The final cinematic text |

### Changing the letter message

The letter has a built-in **edit button** — click the pencil "✏ Edit" icon on the letter card to edit the message directly in the browser. Changes are not saved between sessions, so update `src/data/content.ts` for permanent changes.

---

## 📝 Customizing Memory Captions

Each of the 27 memories has a title, caption, and description. Edit them in **`src/data/memories.ts`**:

```ts
{
  id: 1,
  title: "The Beginning ❤️",    // shown on the polaroid
  caption: "Day one",           // small text under the photo number
  description: "...",           // shown in the full-screen modal when clicked
  imagePath: "/photos/memory-01.jpg",
  side: "left",                 // "left" or "right" — which side of the tree
}
```

---

## 🔁 Quick Start Checklist

- [ ] Add `public/photos/hero.jpg`
- [ ] Add `public/photos/memory-01.jpg` through `memory-27.jpg`
- [ ] Edit `src/data/content.ts` — personalize the letter and text
- [ ] Edit `src/data/memories.ts` — add your own captions
- [ ] (Optional) Add `public/music/birthday.mp3`

---

## 🎬 How the Website Works

| Section | What happens |
|---|---|
| **Cinematic Intro** | Dark screen → particles appear → countdown 3, 2, 1 → fireworks explosion → title reveals → hero photo fades in → "Enter Her Story" button |
| **Birthday Letter** | Handwritten letter with edit mode. Floating hearts. |
| **27 Memories Tree** | Scroll through 27 polaroid photos on a glowing tree. Click any photo for a full-screen view. A sticky counter shows "MEMORY 07 / 27". |
| **Bond Section** | Emotional brother-sister message with cinematic typography. |
| **Advice Section** | 6 pieces of advice that animate in one by one. |
| **Final Scene** | Fireworks, glowing heart, title reveal, replay button. |

---

*Made with love, for Chittu's 27th birthday. ❤️*
