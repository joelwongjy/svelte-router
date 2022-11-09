import { createRouting } from "./lib/routing";

// dynamic import so each route is its own js file when built
// import file lazily so browser loads component only when needed

createRouting({
  routes: [
    { url: "/", component: () => import("./routes/A.svelte") },
    { url: "/b", component: () => import("./routes/B.svelte") },
    { url: "/c", component: () => import("./routes/C.svelte") },
  ],
  target: document.getElementById("app"),
});
