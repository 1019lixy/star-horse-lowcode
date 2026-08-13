/**
 * 命令基类（对标 Astral3D Command）
 *
 * 所有命令必须实现 execute/undo，可选实现 update（可合并命令）。
 */
export abstract class Command {
  protected id: number = -1;
  /** 是否在内存中（不序列化） */
  protected inMemory: boolean = false;
  /** 是否可合并（拖拽中连续触发时合并为一条历史） */
  public updatable: boolean = false;
  protected type: string = "";
  protected name: string = "";

  abstract execute(): void;

  abstract undo(): void;

  toJSON(): { type: string; id: number; name: string } {
    return { type: this.type, id: this.id, name: this.name };
  }

  fromJSON(json: { id: number; name: string }): void {
    this.id = json.id;
    this.name = json.name;
  }

  /** 可合并命令的合并方法（默认空实现） */
  update(_cmd: Command): void {}
}
