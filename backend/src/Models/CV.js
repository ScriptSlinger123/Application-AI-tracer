export class CV {
  constructor(row) {
    Object.assign(this, row);
  }

  static fromRow(row) {
    return row ? new CV(row) : null;
  }

  toJSON() {
    return { ...this };
  }
}
