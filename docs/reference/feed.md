# Feed format

A feed is JSON: either `{ "stories": [...], "categories": [...] }` or a bare story array.
URL sources are fetched with `credentials: 'omit'`.

```json
{
  "stories": [
    {
      "type": "video",
      "id": "s1",
      "title": "Behind the scenes",
      "category": "culture",
      "video": "https://cdn.example/s1.mp4",
      "poster": "https://cdn.example/s1.jpg",
      "preview": "https://cdn.example/s1-preview.mp4",
      "brand": "Publisher",
      "date": "2026-08-01",
      "link": "https://publisher.example/articles/1",
      "readMoreLabel": "Full article"
    },
    {
      "type": "image",
      "id": "s2",
      "title": "Photo of the day",
      "category": "photo",
      "image": "https://cdn.example/s2.jpg",
      "durationMs": 6000
    }
  ],
  "categories": [{ "id": "culture", "label": "Culture" }]
}
```

## Story fields

Common (`type` is `"video"` or `"image"`):

| Field           | Required | Description                                                      |
| --------------- | -------- | ---------------------------------------------------------------- |
| `id`            | yes      | Unique id, reported in every event                               |
| `title`         | yes      | Headline; also the image alt text                                |
| `category`      | yes      | Category id, feeds the menu and filtering                        |
| `brand`         | no       | Byline brand name                                                |
| `brandLogo`     | no       | Byline logo URL                                                  |
| `date`          | no       | Display date, rendered as given                                  |
| `poster`        | no       | Poster image (rail card, pre-load frame)                         |
| `link`          | no       | "Read more" target; only `http(s)` and relative URLs survive     |
| `readMoreLabel` | no       | Custom "read more" label, overriding the locale default          |
| `interactions`  | no       | `{ likeable?, shareable?, initiallyLiked? }` per-story overrides |

Video stories: `video` (required), `renditions`, `preview` (muted hover preview clip),
`durationMs`. Image stories: `image` (required), `durationMs`.

## Validation

`normalizeFeed` applies these rules:

- A story must have string `id` + `title` and matching media (`video` for `type: "video"`,
  `image` for `type: "image"`); anything else is dropped silently.
- `link` values that are not `http:`, `https:`, or relative URLs are removed
  (`javascript:`, `data:`, etc.).
- An empty or missing story list throws `FeedLoadError` and the widget shows its
  "content unavailable" state, emitting `flip-reel:error` with scope `feed`.

## Categories

- When `categories` is omitted, they are derived from story `category` values in order of
  first appearance (id doubles as the label).
- `options.categories` overrides feed categories entirely.
- The synthetic "all" category (`id: "all"`, localized label) is prepended whenever missing.
