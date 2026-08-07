/**
 * 命令集合（对标 Astral3D Commands）
 *
 * 设计决策：命令操作 DtEntity 数据层，而非直接操作 Object3D。
 * Object3D 由视口的 syncEntitiesToScene 自动从 entity 重建。
 * 这样命令可序列化、可回放，且不依赖 Three.js 运行时。
 */
import {Command} from "./index";
import {SIGNAL_NAMES, useDispatchSignal} from "../DtSignals";
import type {DtEntity, DtPoint3D, DtSize3D} from "../../types";

/** 添加实体命令 */
export class AddEntityCommand extends Command {
    readonly entity: DtEntity;
    private parent: { entities: DtEntity[] };

    constructor(entities: DtEntity[], entity: DtEntity) {
        super();
        this.type = "AddEntityCommand";
        this.name = "添加实体";
        this.entity = entity;
        this.parent = {entities};
    }

    execute(): void {
        this.parent.entities.push(this.entity);
        useDispatchSignal(SIGNAL_NAMES.objectAdded, this.entity);
        useDispatchSignal(SIGNAL_NAMES.sceneGraphChanged);
    }

    undo(): void {
        const idx = this.parent.entities.indexOf(this.entity);
        if (idx >= 0) {
            this.parent.entities.splice(idx, 1);
        }
        useDispatchSignal(SIGNAL_NAMES.objectRemoved, this.entity);
        useDispatchSignal(SIGNAL_NAMES.sceneGraphChanged);
    }
}

/** 删除实体命令 */
export class RemoveEntityCommand extends Command {
    readonly entity: DtEntity;
    private parent: { entities: DtEntity[] };
    private index: number = -1;

    constructor(entities: DtEntity[], entity: DtEntity) {
        super();
        this.type = "RemoveEntityCommand";
        this.name = "删除实体";
        this.entity = entity;
        this.parent = {entities};
    }

    execute(): void {
        this.index = this.parent.entities.indexOf(this.entity);
        if (this.index >= 0) {
            this.parent.entities.splice(this.index, 1);
        }
        useDispatchSignal(SIGNAL_NAMES.objectRemoved, this.entity);
        useDispatchSignal(SIGNAL_NAMES.sceneGraphChanged);
    }

    undo(): void {
        if (this.index >= 0 && this.index <= this.parent.entities.length) {
            this.parent.entities.splice(this.index, 0, this.entity);
        } else {
            this.parent.entities.push(this.entity);
        }
        useDispatchSignal(SIGNAL_NAMES.objectAdded, this.entity);
        useDispatchSignal(SIGNAL_NAMES.sceneGraphChanged);
    }
}

/** 设置位置命令（可合并） */
export class SetPositionCommand extends Command {
    readonly entityId: string;
    readonly newValue: DtPoint3D;
    readonly oldValue: DtPoint3D;
    private entities: DtEntity[];

    constructor(entities: DtEntity[], entityId: string, newPosition: DtPoint3D, oldPosition?: DtPoint3D) {
        super();
        this.type = "SetPositionCommand";
        this.name = "设置位置";
        this.updatable = true;
        this.entityId = entityId;
        this.newValue = {...newPosition};
        const entity = entities.find((e) => e.id === entityId);
        this.oldValue = oldPosition ? {...oldPosition} : {...(entity?.position ?? {x: 0, y: 0, z: 0})};
        this.entities = entities;
    }

    execute(): void {
        const entity = this.entities.find((e) => e.id === this.entityId);
        if (!entity) return;
        entity.position = {...this.newValue};
        useDispatchSignal(SIGNAL_NAMES.objectChanged, entity);
    }

    undo(): void {
        const entity = this.entities.find((e) => e.id === this.entityId);
        if (!entity) return;
        entity.position = {...this.oldValue};
        useDispatchSignal(SIGNAL_NAMES.objectChanged, entity);
    }

    update(cmd: SetPositionCommand): void {
        (this.newValue as DtPoint3D).x = cmd.newValue.x;
        (this.newValue as DtPoint3D).y = cmd.newValue.y;
        (this.newValue as DtPoint3D).z = cmd.newValue.z;
    }
}

/** 设置尺寸命令（可合并） */
export class SetSizeCommand extends Command {
    readonly entityId: string;
    readonly newValue: DtSize3D;
    readonly oldValue: DtSize3D;
    private entities: DtEntity[];

    constructor(entities: DtEntity[], entityId: string, newSize: DtSize3D, oldSize?: DtSize3D) {
        super();
        this.type = "SetSizeCommand";
        this.name = "设置尺寸";
        this.updatable = true;
        this.entityId = entityId;
        this.newValue = {...newSize};
        const entity = entities.find((e) => e.id === entityId);
        this.oldValue = oldSize ? {...oldSize} : {...(entity?.size ?? {width: 0, height: 0, depth: 0, radius: 0})};
        this.entities = entities;
    }

    execute(): void {
        const entity = this.entities.find((e) => e.id === this.entityId);
        if (!entity) return;
        entity.size = {...this.newValue};
        useDispatchSignal(SIGNAL_NAMES.objectChanged, entity);
    }

    undo(): void {
        const entity = this.entities.find((e) => e.id === this.entityId);
        if (!entity) return;
        entity.size = {...this.oldValue};
        useDispatchSignal(SIGNAL_NAMES.objectChanged, entity);
    }

    update(cmd: SetSizeCommand): void {
        (this.newValue as DtSize3D).width = cmd.newValue.width;
        (this.newValue as DtSize3D).height = cmd.newValue.height;
        (this.newValue as DtSize3D).depth = cmd.newValue.depth;
        (this.newValue as DtSize3D).radius = cmd.newValue.radius;
    }
}

/** 设置通用属性命令（可合并，对标 SetValueCommand） */
export class SetValueCommand extends Command {
    readonly entityId: string;
    readonly attributeName: keyof DtEntity;
    readonly newValue: any;
    readonly oldValue: any;
    private entities: DtEntity[];

    constructor(entities: DtEntity[], entityId: string, attributeName: keyof DtEntity, newValue: any, oldValue?: any) {
        super();
        this.type = "SetValueCommand";
        this.name = `设置${String(attributeName)}`;
        this.updatable = true;
        this.entityId = entityId;
        this.attributeName = attributeName;
        this.newValue = newValue;
        const entity = entities.find((e) => e.id === entityId);
        this.oldValue = oldValue ?? entity?.[attributeName];
        this.entities = entities;
    }

    execute(): void {
        const entity = this.entities.find((e) => e.id === this.entityId);
        if (!entity) return;
        (entity as any)[this.attributeName] = this.newValue;
        useDispatchSignal(SIGNAL_NAMES.objectChanged, entity);
    }

    undo(): void {
        const entity = this.entities.find((e) => e.id === this.entityId);
        if (!entity) return;
        (entity as any)[this.attributeName] = this.oldValue;
        useDispatchSignal(SIGNAL_NAMES.objectChanged, entity);
    }

    update(cmd: SetValueCommand): void {
        (this as any).newValue = cmd.newValue;
    }
}

/** 移动层级命令（对标 MoveObjectCommand） */
export class MoveEntityCommand extends Command {
    readonly entityId: string;
    readonly newParentId: string | null;
    readonly oldParentId: string | null;
    private entities: DtEntity[];

    constructor(entities: DtEntity[], entityId: string, newParentId: string | null, oldParentId: string | null) {
        super();
        this.type = "MoveEntityCommand";
        this.name = "移动层级";
        this.entityId = entityId;
        this.newParentId = newParentId;
        this.oldParentId = oldParentId;
        this.entities = entities;
    }

    execute(): void {
        const entity = this.entities.find((e) => e.id === this.entityId);
        if (!entity) return;
        entity.parentId = this.newParentId;
        useDispatchSignal(SIGNAL_NAMES.sceneGraphChanged);
    }

    undo(): void {
        const entity = this.entities.find((e) => e.id === this.entityId);
        if (!entity) return;
        entity.parentId = this.oldParentId;
        useDispatchSignal(SIGNAL_NAMES.sceneGraphChanged);
    }
}
