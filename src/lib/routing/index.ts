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
  }

  let currentComponent;
  matchRoute(window.location.pathname);

  // Attach to window instead of all anchor tags
  // Sometimes element may be hidden on toggle and are removed from the DOM so the event listener is gone

  // Never remove this event listener because routing library running through entire application. Only when navigate
  // away from page but browser will do cleanup for us

  window.addEventListener("click", function (event) {
    const clickTarget = event.target;

    // sometimes span contained within anchor tag so have to find parent
    const anchorTag = findAnchorTag(clickTarget as HTMLElement);

    if (!anchorTag) return;

    // if target specified do not block it so that _blank can still work
    if (anchorTag.target) return;

    // to opt out of routing
    if (anchorTag.hasAttribute("no-routing")) return;

    // prevent the usual browser navigation
    event.preventDefault();

    // a.href is the destination but includes the hostname
    const targetLocation = anchorTag.href;

    // create new url to strip the hostname
    const targetPathname = new URL(targetLocation).pathname;

    // 1. update the URL without navigation
    // if using location.href will trigger browser navigation
    history.pushState({}, undefined, targetPathname);

    // 2. match the component and render content
    matchRoute(targetPathname);
  });
}

function findAnchorTag(element: HTMLElement) {
  if (element.tagName === "HTML") return null;
  if (element.tagName === "A") return element;
  else return findAnchorTag(element.parentElement);
}
