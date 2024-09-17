export type PublisherProps = {
  id: number;
  name: string;
  deletionDate: Date | null;
};

export class Publisher {
  private _publisherId!: number;
  private _name!: string;
  private _deletionDate?: Date | null;

  private constructor(name?: string | null, id?: number | null, deletionDate?: Date | null) {
    this._name = name ?? '';

    if (id) this._publisherId = id;
    this._deletionDate = deletionDate;

    this.validate();
  }

  public static create(name?: string | null) {
    return new Publisher(name);
  }
  public static createFromProps(props: PublisherProps) {
    return new Publisher(props.name, props.id, props.deletionDate);
  }

  private validate() {
    if (!this._name || this._name.length < 3) {
      throw new Error('The name must be 3 or more characters.');
    }
  }

  public get id() {
    return this._publisherId;
  }
  public get name() {
    return this._name;
  }
  public get deletionDate() {
    return this._deletionDate;
  }

  public delete() {
    this._deletionDate = new Date();
  }

  public update(name?: string | null) {
    this._name = name ?? '';

    this.validate();
  }
}
