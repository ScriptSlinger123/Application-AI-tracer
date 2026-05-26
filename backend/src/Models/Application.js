export class Application {
  constructor(row) {
    Object.assign(this, row);
  }

  static fromRow(row) {
    return row ? new Application(row) : null;
  }

  toJSON() {
    return { ...this };
  }
}
