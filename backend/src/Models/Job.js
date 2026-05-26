export class Job {
  constructor(row) {
    Object.assign(this, row);
  }

  static fromRow(row) {
    return row ? new Job(row) : null;
  }

  toJSON() {
    return { ...this };
  }
}
