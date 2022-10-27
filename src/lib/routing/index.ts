// routing library

import type { SvelteComponent } from "svelte";
import NotFound from "./NotFound.svelte";

interface Route {
  url: string;
  component: SvelteComponent;
}

export function createRouting({
  routes,
  target,
}: {
  routes: Route[];
  target: HTMLElement;
}) {
  function matchRoute(pathname) {
    if (currentComponent) {
      currentComponent.$destroy();
    }

    const matchedRoute = routes.find((route) => {
      return route.url === pathname;
    });

    const matchedComponent = matchedRoute?.component ?? NotFound;
    currentComponent = new matchedComponent({
      target,
    });

    document.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", function (event) {
        // if target specified do not block it so that _blank can still work
        if (a.target) return;

        // prevent the usual browser navigation
        event.preventDefault();

        // a.href is the destination but includes the hostname
        const targetLocation = a.href;

        // create new url to strip the hostname
        const targetPathname = new URL(targetLocation).pathname;

        // 1. update the URL without navigation
        // if using location.href will trigger browser navigation
        history.pushState({}, undefined, targetPathname);

        // 2. match the component and render content
        matchRoute(targetPathname);
      });
    });
  }

  let currentComponent;
  matchRoute(window.location.pathname);
}
