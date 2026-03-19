export default class Storage {
  public set(key: string, data: any) {
    localStorage.setItem(
      key,
      JSON.stringify({
        type: typeof data,
        data,
      })
    );
  }
  public get<T>(key: string): T | undefined {
    const data = localStorage.getItem(key);
    if (!data) {
      return;
    }
    try {
      const res = JSON.parse(data);
      return res.data;
    } catch (error) {
      return;
    }
  }
  public del(key: string) {}
  public clear(key: string) {}
}
