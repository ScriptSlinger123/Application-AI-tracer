export class User {
  constructor({ id, name, email, created_at }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.created_at = created_at;
  }

  static fromRow(row) {
    if (!row) return null;
    return new User(row);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      created_at: this.created_at,
    };
  }
}
