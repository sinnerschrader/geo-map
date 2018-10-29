export interface TestMapImplementation<T> {
  window: Window;
  el: HTMLElement;
  map: T;
}

export interface TestServiceImplementation<T> {
  window: Window;
  el: HTMLElement;
  service: T;
}
