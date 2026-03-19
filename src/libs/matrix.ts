type TransformDirection = "left" | "top" | "right" | "bottom";

interface Options<T> {
  n?: number;
  m?: number;
  fill?: (index: number) => T | T;
}

export default class Matrix<T> {
  constructor(options?: Options<T>) {
    const n = options?.n ?? 4;
    const m = options?.m ?? 4;
    for (let i = 0; i < n; i++) {
      const row: T[] = new Array(m).fill(null).map((_, index) => {
        const rIndex = i * n + index;
        const fill = options?.fill;
        if (fill !== void 0) {
          if (typeof fill === "function") {
            return fill(rIndex);
          }
          return fill;
        }
        return rIndex as T;
      });
      this.list.push(row);
    }
    this.n = n;
    this.m = m;
    this.total = n * m;
  }

  public n: number = 0;
  public m: number = 0;
  public total: number = 0;
  public list: T[][] = [];

  public transform(direction: TransformDirection, size: number = 1) {
    const left = () => {
      const len = this.n - 1;
      for (let i = 0; i < len; i++) {
        const row = this.list[i];
        top(row);
      }
    };

    const right = () => {
      const len = this.n - 1;
      for (let i = 0; i < len; i++) {
        const row = this.list[i];
        bottom(row);
      }
    };

    const top = (datas: any[], size?: number) => {
      const len = datas.length - 1;
      for (let i = 0; i < len; i++) {
        [datas[i], datas[i + 1]] = [datas[i + 1], datas[i]];
      }
    };

    const bottom = (datas: any[], size?: number) => {
      const len = datas.length - 1;
      for (let i = len; i > 0; i--) {
        [datas[i], datas[i - 1]] = [datas[i - 1], datas[i]];
      }
    };

    switch (direction) {
      case "left":
        left();
        break;
      case "right":
        right();
        break;
      case "top":
        top(this.list);
        break;
      case "bottom":
        bottom(this.list);
        break;
      default:
        break;
    }
  }
}
