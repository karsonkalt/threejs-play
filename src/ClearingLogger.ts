function getQuery() {
  return Object.fromEntries(
    new URLSearchParams(window.location.search).entries()
  );
}

class ClearingLogger {
  elem: HTMLElement;
  lines: string[];

  constructor(elem: HTMLElement) {
    this.elem = elem;
    this.lines = [];
  }

  log(...args: any[]) {
    this.lines.push(args.join(" "));
  }

  render() {
    this.elem.textContent = this.lines.join("\n");
    this.lines = [];
  }
}

class DummyLogger {
  log() {}
  render() {}
}

const query = getQuery();
const debug = query.debug === "true";

export const logger = debug
  ? new ClearingLogger(document.querySelector("#debug pre")!)
  : new DummyLogger();

if (debug) {
  (document.querySelector("#debug")! as any).style.display = "";
}
