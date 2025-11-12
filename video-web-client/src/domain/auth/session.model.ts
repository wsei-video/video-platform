export class Session {
  constructor(
    public id: string,
    public device: string | null,
    public browser: string | null,
    public lastAccessAt: Date,
    public createdAt: Date,
  ) {}
}
