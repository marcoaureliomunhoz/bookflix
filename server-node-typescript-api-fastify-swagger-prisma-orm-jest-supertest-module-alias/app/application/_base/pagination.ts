export class Pagination {
  private _page?: number | null;
  private _pageSize?: number | null;
  private _listSize?: number | null;
  private _numberOfPages?: number | null;

  public static create(page?: number | null, pageSize?: number | null, listSize?: number | null) {
    return new Pagination(page, pageSize, listSize);
  }

  private constructor(page?: number | null, pageSize?: number | null, listSize?: number | null) {
    this._page = page;
    this._pageSize = pageSize;
    this._listSize = listSize;

    const numberOfPages = listSize && pageSize && pageSize > 0 ? Math.ceil(listSize / pageSize) : null;
    this._numberOfPages = numberOfPages && numberOfPages < 1 ? 1 : numberOfPages;
  }

  public get page() {
    return this._page;
  }
  public get pageSize() {
    return this._pageSize;
  }
  public get listSize() {
    return this._listSize;
  }
  public get numberOfPages() {
    return this._numberOfPages;
  }
}
