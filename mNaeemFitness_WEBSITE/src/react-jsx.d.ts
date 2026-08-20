// Declaration to help TypeScript find the new JSX runtime modules
// filepath: src/react-jsx.d.ts
// ...existing code...
declare module "react/jsx-runtime";
declare module "react/jsx-dev-runtime";

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
