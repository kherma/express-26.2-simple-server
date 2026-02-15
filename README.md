# Express Hello + Local 404

Simple Node + Express server that serves HTML pages for routes and a local SVG image for 404.

Run:

```bash
npm install
npm start
# then open http://localhost:3000/
```

Routes:

- `/` or `/home` -> Hello world (HTML file)
- `/about` -> About me (HTML file)
- `/user/*` (e.g. `/user/settings`, `/user/panel`) -> middleware returns a login-required HTML response
- any other path -> 404 page with locally served image
