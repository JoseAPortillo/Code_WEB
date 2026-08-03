# Project media

Screenshots and video clips shown on each project detail page (`/projects/<name>`).

## Layout

```
src/frontend/media/<project>/
```

Each file is served at `/static/media/<project>/<file>` (the whole `src/frontend`
directory is mounted at `/static`).

## Placeholders

The project pages currently render `[image/video pending]` placeholders. To add
real content:

1. Drop the file into `src/frontend/media/<project>/` (e.g. `media/aimation/aimation-1.png`)
2. Replace the matching `.project-media-placeholder` block in
   `src/frontend/projects/<project>.html` with an `<img>` or `<video>` tag

Example:

```html
<figure class="project-media-item">
    <img src="/static/media/aimation/aimation-1.png" alt="Node editor — image-to-video workflow"/>
    <figcaption>Node editor &mdash; building an image-to-video workflow</figcaption>
</figure>
```

## Names used per project

- `aimation/` — aimation-1.png, aimation-2.mp4, aimation-3.png
- `cuqui/` — cuqui-1.png, cuqui-2.png, cuqui-3.mp4
- `multicams-watcher/` — multicams-watcher-1.png, multicams-watcher-2.mp4, multicams-watcher-3.png
