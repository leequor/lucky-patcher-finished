import "@testing-library/jest-dom/vitest";

// jsdom ships a canvas element without a drawing context. The 3D scene is
// decorative, so tests only need the element to render without a context.
if (typeof HTMLCanvasElement !== "undefined") {
  Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
    value: () => null,
    writable: true,
  });
}

// React Three Fiber measures its canvas with ResizeObserver, which jsdom does
// not provide. The observer is inert here; the WebGL fallback renders instead.
if (typeof globalThis.ResizeObserver === "undefined") {
  Object.defineProperty(globalThis, "ResizeObserver", {
    value: class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
    writable: true,
  });
}
