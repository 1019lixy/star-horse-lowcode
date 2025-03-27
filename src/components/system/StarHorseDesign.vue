<script setup lang="ts" name="StarHorseDesign">
  import { computed, nextTick, onMounted, PropType, provide, ref, watch } from "vue";
  import { Cell, Graph, Shape, View } from "@antv/x6";
  import { operationConfirm, warning } from "@/utils/message.ts";
  import { CompInfo, CustomerItem, NodeInfo } from "@/components/types/CompInfo.d.ts";
  import { commands, configInfo, helpMessage, ports, tableConfigInfo } from "@/utils/sh_design.ts";
  import StarHorseIcon from "@/components/comp/StarHorseIcon.vue";
  import { ApiUrls } from "@/components/types/ApiUrls.d.ts";
  import { PageFieldInfo } from "@/components/types/PageFieldInfo.d.ts";
  import piniaInstance from "@/store";
  import { useDesignGraphStore } from "@/store/DesignGraph.ts";
  import { closeLoad, formFieldMapping, load } from "@/api/star_horse_utils.ts";
  import Help from "@/components/help.vue";
  import ConsumerDbListComp from "@/components/common/ConsumerDbListComp.vue";
  import StarHorseEditor from "@/components/system/StarHorseEditor.vue";
  import { useConsumerViewStore } from "@/store/ConsumerView.ts";
  import { Config } from "@/api/settings.ts";
  import { dynamicFormContextMenuData } from "@/plugins/AblesPlugin.ts";

  const designGraph = useDesignGraphStore(piniaInstance);
  const consumerView = useConsumerViewStore(piniaInstance);
  const starHorseDesignRef = ref();
  const graph = ref();
  const contextmenuRef = ref();
  const leftPanelVisible = ref<boolean>(true);
  const connectorStyle = ref<string>("normal");
  const rightPanel = ref<boolean>(false);
  const normalRightPanel = ref<boolean>(true);
  const currentComp = ref<any>();
  const currentCellInfo = ref<any>({});
  const fieldList = ref<PageFieldInfo>();
  const menuPosition = ref({
    top: "0px",
    left: "0px"
  });
  const props = defineProps({
    registerNode: { type: Object, default: null },
    lineHeight: { type: Number, default: 24 },
    tableWidth: { type: Number, default: 320 },
    tableFlag: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    compUrl: { type: Object as PropType<ApiUrls> },
    nodeFieldList: { type: Object as PropType<PageFieldInfo> },
    lineFieldList: { type: Object as PropType<PageFieldInfo> },
    batchName: { type: String, default: "batchDataList" },
    batchFieldName: { type: String, default: "batchFieldList" },
    primaryKey: {type: [String, Object] as PropType<string | any>,required:true},
    rules: { type: Object },
    showCompList: { type: Object, required: true },
    showDbList: { type: Object, required: false },
    //table,normal,其他待定
    compType: { type: String, default: "normal" },
    //drawer,normal
    activeCollapse: { type: String, default: "0" },
    panelStyle: { type: String, default: "normal" },
    customerItems: { type: Array as PropType<CustomerItem[]>, default: [] }
  });
  const tabModel = computed(() => (props.showCompList ? "dynamicTable" : "dbList"));
  const emits = defineEmits(["config", "lineClick", "nodeClick", "save", "validation", "preview"]);
  let compAttr = ref<any>({});
  provide("dataForm", compAttr);
  const dataForm = defineModel("dataForm");
  const jsonData = ref<string>();
  const dataPreviewVisible = ref<boolean>(false);
  let activeItem = computed(() => props.activeCollapse);
  const hasData = ref<Array<any>>([]);
  const transform = (command: string) => {
    switch (command) {
      case "translate":
        graph.value.translate(20, 20);
        break;
      case "zoomIn":
        graph.value.zoom(0.2);
        break;
      case "zoomOut":
        graph.value.zoom(-0.2);
        break;
      case "zoomTo":
        graph.value.zoomTo(1);
        break;
      case "zoomToFit":
        graph.value.zoomToFit();
        break;
      case "centerContent":
        graph.value.centerContent();
        break;
      case "reDo":
        graph.value.redo();
        break;
      case "unDo":
        graph.value.undo();
        break;
      case "lineMode":
        connectorStyle.value = "normal";
        break;
      case "verticalMode":
        connectorStyle.value = "rounded";
        break;
      case "leftPanel":
        leftPanelVisible.value = !leftPanelVisible.value;
        break;
      case "rightPanel":
        normalRightPanel.value = !normalRightPanel.value;
        break;
      case "empty":
        operationConfirm("清空画布，所有的数据都会丢失，确定要清空吗？").then((res) => {
          if (res) {
            nodeList.value = [];
            graph.value.resetCells([]);
            nodeIndex = 0;
            hasItems();
          }
        });
        break;
      case "valid":
        dataValid();
        break;
      case "json":
        //显示JSON数据
        jsonData.value = JSON.stringify(graph.value.toJSON(), null, 4);
        dataPreviewVisible.value = true;
        break;
      case "save":
        emits("save", analisyAllData());
        break;
      case "config":
        emits("config", analisyAllData());
        break;
      case "preview":
        emits("preview", analisyAllData());
        break;
      default:
        alignOperation(command);
        break;
    }
    hasItems();
  };
  let hasItemFlag = ref<boolean>(false);
  const hasItems = () => {
    let cells = graph?.value?.getNodes();
    hasData.value = cells;
    return (hasItemFlag.value = cells?.length > 0 && !props.readonly);
  };
  const closeAction = () => {
    dataPreviewVisible.value = false;
  };
  const dataValid = () => {};
  const alignOperation = (align: string) => {
    let cells = graph.value.getSelectedCells();
    if (align == "deleteItem" || align == "delete") {
      if (!cells || cells.length == 0) {
        warning("请先选择要删除的对象");
        return;
      }
      operationConfirm("确定要删除所选的元素吗？").then((res) => {
        if (res) {
          deleteNode(cells);
          graph.value.removeCells(cells);
          currentComp.value = null;
          hasItems();
        }
      });
      return;
    }
    hasItems();
    if (!cells || cells.length == 0) {
      cells = graph.value.getNodes();
    }
    if (cells?.length == 0) {
      return;
    }
    // for (let index in cells) {
    //   let _cell = cells[index];
    //   //  console.log(cell.position());
    // }
    if (align == "alignTop") {
      let pos = cells.map((item: any) => item.position().y);
      let min = Math.min(...pos);
      for (let index in cells) {
        let cell = cells[index];
        cell.setPosition(cell.position().x, min);
      }
    }
    if (align == "alignBottom") {
      let pos = cells.map((item: any) => item.position().y);
      let max = Math.max(...pos);
      for (let index in cells) {
        let cell = cells[index];
        cell.setPosition(cell.position().x, max);
      }
    }
    if (align == "alignLeft") {
      let pos = cells.map((item: any) => item.position().x);
      let min = Math.min(...pos);
      for (let index in cells) {
        let cell = cells[index];
        cell.setPosition(min, cell.position().y);
      }
    }
    if (align == "alignRight") {
      let pos = cells.map((item: any) => item.position().x);
      let max = Math.max(...pos);
      for (let index in cells) {
        let cell = cells[index];
        cell.setPosition(max, cell.position().y);
      }
    }
  };
  const contextMenuVisible = ref<boolean>(false);
  const visibleChange = (flag: boolean) => {
    if (!flag) {
      contextMenuVisible.value = false;
    }
  };
  let nodeList = ref<Array<Cell>>([]);
  const init = async () => {
    registerPort(props.registerNode?.portName);
    if (props.registerNode) {
      registerNode(props.registerNode.name, props.registerNode.entity, props.registerNode.force);
    }
    await nextTick();
    graph.value = new Graph({
      autoResize: true,
      container: starHorseDesignRef.value,
      ...(props.compType == "table" ? tableConfigInfo : configInfo)
    });
    graph.value.resetCells([]);
    designGraph.setGraph(graph.value, props.readonly);
    console.log("画布初始化完成。。。");
    // delete
    graph.value.bindKey(["backspace", "delete"], () => {
      alignOperation("deleteItem");
    });
    // 控制连接桩显示/隐藏
    const showPorts = (ports: NodeListOf<SVGElement>, show: boolean) => {
      for (let i = 0, len = ports.length; i < len; i += 1) {
        let temp = ports[i];
        //过滤掉表格的字段
        if (temp.localName != "g") {
          temp.style.visibility = show ? "visible" : "hidden";
        }
      }
    };
    graph.value.on("cell:mouseenter", (data: any) => {
      const ports = starHorseDesignRef.value.querySelectorAll(".x6-port-body") as NodeListOf<SVGElement>;
      showPorts(ports, true);
      if (data.cell.isNode()) {
        data.cell.addTools([
          {
            name: "boundary",
            args: {
              attrs: {
                fill: "#7c68fc",
                stroke: "#333",
                "stroke-width": 1,
                "fill-opacity": 0.2
              }
            }
          }
        ]);
      } else {
        data.cell.addTools([
          { name: "segments" },
          {
            name: "source-arrowhead"
          },
          {
            name: "target-arrowhead",
            args: {
              attrs: {
                fill: "blue"
              }
            }
          }
        ]);
      }
    });
    graph.value.on("cell:mouseleave", (data: any) => {
      const ports = starHorseDesignRef.value.querySelectorAll(".x6-port-body") as NodeListOf<SVGElement>;
      showPorts(ports, false);
      if (data.cell.isNode()) {
        data.cell.removeTools();
      } else {
        data.cell.removeTools(["source-arrowhead", "target-arrowhead"]);
      }
    });
    // #endregion
    graph.value.on("cell:added", (edge: any) => {
      designGraph.setCell(edge.cell, true);
      if (edge.cell.isEdge() && props.compType != "table") {
        designGraph.setLabel("OK", "#15C912");
      } else {
        clickOperation(edge);
      }
    });
    graph.value.on("edge:connected", (edge: any) => {
      clickOperation(edge.view);
    });
    //节点右键菜单
    graph.value.on("cell:contextmenu", (data: any) => {
      contextMenu(data.e, data.x, data.y, data.cell, data.view);
    });
    // //连线右键菜单
    // //点击节点
    graph.value.on("cell:click", (data: any) => {
      // graph.value.trigger("blank:click", {e, x, y, edge, view});
      if (props.panelStyle == "normal" || props.compType == "table") {
        clickOperation(data.view);
      }
      if (data.cell.isEdge()) {
        data.cell.addTools([
          {
            name: "boundary",
            args: {
              attrs: {
                fill: "#7c68fc",
                stroke: "#333",
                "stroke-width": 1,
                "fill-opacity": 0.2
              }
            }
          }
        ]);
      }
    });
    graph.value.on("blank:click", () => {
      let cells = graph.value.getCells();
      for (let index in cells) {
        cells[index].removeTools();
      }
      currentComp.value = null;
    });
    if (props.panelStyle == "drawer") {
      //点击连线
      graph.value.on("cell:dblclick", async (data: any) => {
        clickOperation(data.view);
      });
    }
  };
  const clickOperation = async (view: any) => {
    let cell = view.cell;
    const isNode = cell.isNode();
    if (isNode || cell.isEdge()) {
      designGraph.setCell(cell);
    }
    hasItems();
    let data = getCellnfo(cell)!;
    if (!isNode) {
      // graph.value.trigger("blank:click", {view});
      graph.value.trigger("edge:click", { view });
    }
    currentCellInfo.value = data;
    if (data?.fromType == "table") {
      emits(isNode ? "nodeClick" : "lineClick", data);
      //
    } else {
      currentComp.value = cell;
      await readCompAttr();
      if (props.panelStyle == "drawer") {
        rightPanel.value = true;
      }
      await nextTick(() => {
        rightAttrPanel.value?.setFormData(compAttr.value);
      });
    }
  };
  let currentView = ref<View>();
  const checkIsNode = () => {
    let flag = !currentComp.value ? 3 : currentComp.value.isNode() ? 1 : 2;
    return flag;
  };
  /**
   * 删除指定节点
   * @param cells
   */
  const deleteNode = (cells: Array<any>) => {
    for (let cindex in cells) {
      let cell = cells[cindex];
      for (let index in nodeList.value) {
        let temp = nodeList.value[index];
        if (temp.id == cell.id) {
          nodeList.value.splice(Number(index), 1);
        }
      }
    }
    hasItems();
  };
  const contextMenuOperation = (type: any) => {
    console.log(type);
    if (type == "copy") {
      graph.value.copy([currentComp.value]);
    } else if (type == "cut") {
      graph.value.cut([currentComp.value]);
    } else if (type == "paste") {
      const cells = graph.value.paste({ offset: 32 });
      graph.value.cleanSelection();
      graph.value.select(cells);
    } else {
      transform(type);
    }
  };
  const contextMenu = (e: MouseEvent, _x: number, _y: number, cell: Cell, view: View) => {
    console.log(cell, view);
    // const menuWidth = 280;
    currentView.value = view;
    contextMenuVisible.value = true;
    currentComp.value = cell;
    graph.value.select(cell);
    menuPosition.value = {
      top: `${e.pageY}px`, // 仍然使用页面坐标设置菜单位置
      left: `${e.pageX}px`
    };
    nextTick(() => {
      contextmenuRef.value.show();
    });
  };
  /**
   * 更改标签信息
   */
  const changeLabelText = (val: any, color: string = "#15C912") => {
    if (currentComp.value.isNode()) {
      currentComp.value!.setAttr("label/text", val);
    } else {
      currentComp.value!.removeLabelAt(0);
      currentComp.value!.insertLabel("OK", 0);
      currentComp.value!.getLabelAt(0)["attrs"]["label"] = {
        fill: color,
        text: val
      };
    }
  };
  /**
   * 注册节点
   * @param name
   * @param entry
   */
  const registerNode = (name: string, entry: any, force: boolean = false) => {
    Graph.registerNode(name, entry, force);
  };
  /**
   * 注册装
   */
  const registerPort = (portName: string) => {
    Graph.registerNode(
      "custom-rect",
      {
        inherit: "rect",
        width: 140,
        height: 50,
        attrs: {
          body: {
            strokeWidth: 1,
            stroke: "#5F95FF",
            fill: "#EFF4FF",
            rx: 10,
            ry: 10
          },
          image: {
            // 'xlink:href': defaultSvg,
            width: 16,
            height: 16,
            x: 12,
            y: 12
          },
          text: {
            fontSize: 12,
            fill: "#262626",
            textAnchor: "middle",
            textVerticalAnchor: "middle"
          }
        },
        markup: [
          {
            tagName: "rect",
            selector: "body"
          },
          {
            tagName: "svg",
            selector: "image",
            children: [
              {
                tagName: "use"
              }
            ]
          },
          {
            tagName: "text",
            selector: "text"
          }
        ],
        ports: { ...ports }
      },
      true
    );
    // 注册自定义节点 图标+标题+描述
    Shape.HTML.register({
      shape: "cu-data-node",
      width: "auto",
      height: 104,
      effect: ["data"],
      html(cell) {
        // 获取节点传递过来的数据
        const redata = cell.getData();
        // 创建自定义的节点容器
        const container = document.createElement("div");
        container.setAttribute("class", "cu-container");
        // 图片根据不同的类型进行切换，可以是后端返回的图标，也可以是自己本地的图标，如果是后端返回就通过节点的data传进来
        const container_img = document.createElement("img");
        container_img.src = "@/icons/default.svg";
        container_img.setAttribute("class", "cu-container-img");
        const container_title = document.createElement("div");
        container_title.innerText = redata.label;
        container_title.setAttribute("class", "cu-container-title");
        const container_desc = document.createElement("div");
        container_desc.setAttribute("class", "cu-container-desc");
        container_desc.innerText = redata.desc || "描述信息";
        container.appendChild(container_img);
        container.appendChild(container_title);
        container.appendChild(container_desc);
        return container;
      }
    });
    if (portName) {
      Graph.registerPortLayout(
        portName,
        (portsPositionArgs: any) => {
          return portsPositionArgs.map((_a: any, index: number) => {
            return {
              position: {
                x: 0,
                y: (index + 1) * props.lineHeight
              },
              angle: 0
            };
          });
        },
        true
      );
    }
  };
  const analisyAllData = () => {
    let cells = graph.value.getCells();
    let tableList = [];
    let relationList = [];
    for (let index in cells) {
      let cell = cells[index];
      console.log(cell);
      if (cell.isNode()) {
        tableList.push(getCellnfo(cell));
      } else {
        relationList.push(getCellnfo(cell));
      }
    }
    return { tables: tableList, relations: relationList };
  };
  /**
   * 获取
   * @param cell
   */
  const getCellnfo = (cell: any) => {
    if (!cell) {
      return;
    }
    let isNode = cell.isNode();
    if (isNode) {
      let data = cell.getData();
      return {
        fromId: cell.id,
        fromType: data.compType,
        from: data.fieldName || data.name || data.id,
        fromData: data
      };
    } else {
      let sourceNode = cell.getSourceNode();
      let sourceInfo = sourceNode?.getData();
      console.log(sourceInfo);
      let sourcePort = sourceNode?.getPort(cell.store.data?.source.port);
      let targetNode = cell.getTargetNode();
      let targetInfo = targetNode?.getData();
      if (!targetInfo) {
        console.log("连线没有目标节点");
        return;
      }
      let targetPort = targetNode.getPort(cell.store.data?.target.port);
      if (!targetPort) {
        console.log("连线没有目标属性");
        return;
      }
      let fromId = sourceNode.id;
      let from = sourceInfo.fieldName || sourceInfo.name || sourceInfo.id;
      let fromLabel = sourceInfo.label;
      let fromType = sourceInfo.compType;
      let fromPort = sourcePort.attrs?.name?.text || sourcePort.attrs?.fieldName?.text || sourcePort.id;
      let toId = targetNode.id;
      let to = targetInfo.fieldName || targetInfo.name || sourceInfo.id;
      let toLabel = targetInfo.label;
      let toType = targetInfo.compType;
      console.log(sourcePort, targetPort);
      let toPort = targetPort?.attrs?.name?.text || targetPort?.attrs?.fieldName?.text || targetPort.id;
      return {
        fromId,
        from,
        fromLabel,
        fromPort,
        fromType,
        fromData: sourceInfo,
        toId,
        to,
        toLabel,
        toPort,
        toType,
        toData: targetInfo
      };
    }
  };
  /**
   * 获取所有连线的数据
   */
  const edgeList = () => {
    let edgeList = graph.value.getEdges();
    let dataList: any = [];
    if (edgeList && edgeList.length > 0) {
      edgeList.forEach((item: any) => {
        dataList.push(getCellnfo(item));
      });
    }
    return dataList;
  };
  const dratStart = (item: any, evt: DragEvent) => {
    let dt = evt.dataTransfer!;
    dt.effectAllowed = "copy";
    dt.setData("text/plain", JSON.stringify(item));
  };
  let nodeIndex = 0;
  const dragDrop = (evt: DragEvent) => {
    let dt = evt.dataTransfer!;
    let data = JSON.parse(dt.getData("text/plain")) as NodeInfo;
    data["index"] = nodeIndex++;
    data["posX"] = evt.pageX;
    data["posY"] = evt.pageY;
    //有items 数据
    if (Object.keys(data).includes("items")) {
      data["shape"] = "er-rect";
      data["compType"] = "table";
    } else {
      data["shape"] = "custom-rect";
      //创建普通节点
    }
    addNode(data);
  };
  /**
   * 添加节点
   * @param data
   */
  const addNode = (data: any) => {
    //如果网络慢可能还没有数据回来
    if (Object.keys(data).includes("items") && data["items"]?.length == 0) {
      load("数据解析中");
      data["items"] = consumerView.getTableInfo(data["name"]);
      setTimeout(() => {
        let cell = designGraph.addNode(data);
        nodeList.value.push(cell);
        closeLoad();
      }, 500);
    } else {
      let cell = designGraph.addNode(data);
      nodeList.value.push(cell);
    }
    return nodeList;
  };
  const dragOver = (evt: DragEvent) => {
    evt.preventDefault();
  };
  const query = ref<string>("");
  const filterDatas = ref<Array<CustomerItem>>([]);
  const onQueryChanged = () => {
    let dataList = JSON.parse(JSON.stringify(props.customerItems));
    filterDatas.value = [];
    activeItem.value = [];
    if (!query.value) {
      filterDatas.value = dataList;
    } else {
      for (let index in dataList) {
        let temp = dataList[index];
        let matchDatas = temp.compItems.filter((item: CompInfo) => item.label.indexOf(query.value) != -1);
        // console.log(matchDatas);
        if (matchDatas && matchDatas.length > 0) {
          temp.compItems = matchDatas;
          filterDatas.value.push(temp);
          activeItem.value.push(temp.name);
        }
      }
    }
  };
  const writeAttrToComp = () => {
    // console.log("writeAttrToComp")
    currentComp.value.setData(compAttr.value);
    compAttr.value = {};
  };
  let rightAttrPanel = ref();
  const readCompAttr = async () => {
    let data = currentComp.value.getData() || {};
    let isNode = currentComp.value.isNode();
    fieldList.value = isNode ? props.nodeFieldList : props.lineFieldList;
    let redata = formFieldMapping(fieldList.value!);
    compAttr.value = {};
    if (data) {
      compAttr.value = data;
    } else {
      compAttr.value = { ...data, ...redata.defaultDatas };
    }
    for (let key in redata.mappingFields) {
      let temp = redata.mappingFields[key];
      if (!compAttr.value[temp.name]) {
        compAttr.value[temp.name] = data[temp.alias];
      }
      if (currentCellInfo.value[temp.alias]) {
        compAttr.value[temp.name] = currentCellInfo.value[temp.alias];
      }
    }
    compAttr.value["nodeFlag"] = isNode;
    // console.log(data, currentCellInfo.value, defaultDatas, mappingFields, compAttr.value);
  };
  onMounted(() => {
    init();
    filterDatas.value = props.customerItems;
  });
  watch(
    () => props.customerItems,
    () => {
      filterDatas.value = props.customerItems;
    },
    {
      deep: true
    }
  );
  watch(
    () => compAttr.value,
    (val) => {
      currentComp.value.setData(val);
    },
    {
      immediate: false,
      deep: true
    }
  );
  defineExpose({
    graph,
    registerPort,
    registerNode,
    nodeList,
    getEdgeInfo: getCellnfo,
    edgeList,
    changeLabelText,
    addNode
  });
</script>
<template>
  <star-horse-dialog
    :dialogVisible="dataPreviewVisible"
    :title="'JSON'"
    @closeAction="closeAction"
    :isBatch="false"
    :isView="true"
  >
    <star-horse-editor :value="jsonData" :lang="'json'" />
  </star-horse-dialog>
  <div class="design-content">
    <div class="comp-list" v-show="leftPanelVisible && !readonly">
      <el-tabs v-model="tabModel">
        <el-tab-pane name="dynamicTable" v-if="showCompList">
          <template #label>
            <star-horse-icon icon-class="setting" style="color: var(--star-horse-style)" />&nbsp;<span>组件</span>
          </template>
          <el-input
            v-model="query"
            :size="Config.compSize"
            clearable
            placeholder="请输入关键字"
            @keydown.enter="onQueryChanged"
          >
            <template #append>
              <star-horse-icon @click="onQueryChanged" icon-class="search" color="var(--star-horse-style)" />
            </template>
          </el-input>
          <el-scrollbar>
            <el-collapse accordion v-model="activeItem">
              <template v-for="item in filterDatas">
                <el-collapse-item :name="item.name" :title="item.title" type="default">
                  <el-scrollbar max-height="350">
                    <ul>
                      <li
                        draggable="true"
                        @dragstart="(evt) => dratStart(sitem, evt)"
                        class="field-item"
                        v-for="sitem in item.compItems"
                        ><span
                          >&nbsp;&nbsp;<star-horse-icon :icon-class="sitem.icon || 'default'" />&nbsp;{{
                            sitem.label || sitem.name
                          }}</span
                        >
                      </li>
                    </ul>
                  </el-scrollbar>
                </el-collapse-item>
              </template>
            </el-collapse>
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane name="dbList" v-if="showDbList">
          <template #label>
            <star-horse-icon icon-class="database" style="color: var(--star-horse-style)" />&nbsp;<span>数据源</span>
          </template>
          <ConsumerDbListComp />
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="design-main">
      <div class="inner_button">
        <el-menu mode="horizontal" :ellipsis="false" style="height: inherit; width: 100%">
          <template v-for="(item, index) in commands">
            <el-menu-item v-if="(hasData.length > 0 && !readonly) || item.defaultEdit">
              <el-tooltip class="item" :content="item.label" :index="index" effect="dark" placement="bottom">
                <star-horse-icon
                  @click="transform(item.key)"
                  :icon-class="item.icon"
                  size="22px"
                  style="color: var(--star-horse-style)"
                />
              </el-tooltip>
            </el-menu-item>
          </template>
        </el-menu>
        <help :message="helpMessage" />
      </div>
      <div class="background-grid-app">
        <div
          id="graph-dropdown"
          @dragover.prevent="dragOver"
          @drop="dragDrop"
          class="app-content"
          ref="starHorseDesignRef"
        ></div>
        <Teleport to="body">
          <ContentMenu
            ref="contextmenuRef"
            :style="{ 'z-index': 99999999, position: 'absolute', top: menuPosition.top, left: menuPosition.left }"
            v-if="contextMenuVisible && !readonly"
            :menu-data="dynamicFormContextMenuData({}, {}, 'scene', contextMenuOperation)"
          />
        </Teleport>
      </div>
    </div>
    <div class="right-attr-panel" v-if="panelStyle == 'normal'" v-show="normalRightPanel">
      <div class="title">属性面板</div>
      <div class="item" style="border-bottom: none">
        <div class="content" v-if="checkIsNode() == 1">
          <h3>{{ compAttr["label"] || currentComp.label }}({{ compAttr["belongTo"] || "组件" }})</h3>
        </div>
        <div class="content" v-else-if="checkIsNode() == 2">
          <h3>连线属性</h3>
        </div>
      </div>
      <hr />
      <star-horse-form
        v-model:data-form="dataForm"
        v-if="checkIsNode() == 1"
        :isView="readonly"
        ref="rightAttrPanel"
        @refresh="() => {}"
        :compUrl="compUrl"
        :fieldList="nodeFieldList"
        :rules="rules"
      />
      <star-horse-form
        v-model:data-form="dataForm"
        v-else-if="checkIsNode() == 2"
        :isView="readonly"
        ref="rightAttrPanel"
        @refresh="() => {}"
        :compUrl="compUrl"
        :fieldList="lineFieldList"
        :rules="rules"
      />
      <div v-else class="empty-info">
        <el-empty description="点击画布中的组件或者连线可设置属性" />
      </div>
    </div>
  </div>
  <el-drawer
    v-if="panelStyle == 'drawer'"
    v-model="rightPanel"
    title="属性面板"
    direction="rtl"
    :modal="false"
    @close="writeAttrToComp"
    size="30%"
  >
    <div class="item" style="border-bottom: none">
      <div class="content" v-if="checkIsNode() == 1">
        <h3>{{ compAttr["label"] }}({{ compAttr["belongTo"] }})</h3>
      </div>
      <div class="content" v-else-if="checkIsNode() == 2">
        <h3>连线属性</h3>
      </div>
    </div>
    <hr />
    <star-horse-form
      v-model:data-form="dataForm"
      v-if="checkIsNode() == 1"
      ref="rightAttrPanel"
      @refresh="() => {}"
      :compUrl="compUrl"
      :fieldList="nodeFieldList"
      :rules="rules"
    />
    <star-horse-form
      v-model:data-form="dataForm"
      v-else-if="checkIsNode() == 2"
      ref="rightAttrPanel"
      @refresh="() => {}"
      :compUrl="compUrl"
      :fieldList="lineFieldList"
      :rules="rules"
    />
    <div v-else class="empty-info"> 右侧面板</div>
  </el-drawer>
</template>
<style lang="scss" scoped>
  :deep(.el-menu-item) {
    padding: 0 5px;
  }

  .x6-edge-selected {
    border: 1px dashed #3a8ee6;
  }

  hr {
    height: 1px;
    margin: 10px 0;
    border: 0;
    clear: both;
  }

  .el-drawer__header {
    border-bottom: 1px solid #8f8f8f;
    padding: 10px;
    margin-bottom: 10px;
    height: 40px;
    line-height: 40px;
    text-indent: 0.5em;
    background: var(--star-horse-font-color);

    span {
      font-weight: bold;
      font-size: 14px;
    }
  }

  .design-content {
    display: flex;
    height: 100%;
    width: 100%;
    flex-direction: row;

    .comp-list {
      min-width: 205px;
      margin-right: 5px;
      border: 1px solid #eee;

      .el-collapse {
        padding-left: 5px;
      }

      &:after,
      &:before {
        box-sizing: border-box;
      }

      ul {
        margin: 0;
        padding: 0;

        &:after {
          content: "";
          display: block;
          clear: both;
        }

        .field-item {
          display: flex;
          height: 28px;
          line-height: 28px;
          width: 99%;
          margin-bottom: 2px;
          margin-left: 2px;
          cursor: move;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          background: var(--star-horse-font-color);
          border-radius: 3px;

          span {
            display: flex;
            align-content: center;
            align-items: center;
          }
        }

        .field-item:first-child {
          margin-top: 5px;
        }

        .field-item:hover {
          background: #ebeef5;
          outline: 1px solid #999999;
        }

        .drag-handler {
          position: absolute;
          top: 0;
          left: 160px;
          background-color: #dddddd;
          border-radius: 5px;
          padding-right: 5px;
          font-size: 11px;
          color: #666666;
        }
      }
    }

    .design-main {
      flex: 1;
      height: 100%;
      /*min-height: 500px;*/
      display: flex;
      flex-direction: column;

      .inner_button {
        height: 40px;
        text-align: left;
        justify-content: flex-start;
        background-color: #fafafa;
        border: solid 1px #ccc;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }

      .background-grid-app {
        display: flex;
        flex: 1;
        padding: 0;
        font-family: sans-serif;
      }
    }

    .right-attr-panel {
      width: 280px;
      display: flex;
      flex-direction: column;
      border: 1px solid #eee;
      margin-left: 5px;

      .title {
        padding-left: 5px;
        align-items: center;
        vertical-align: middle;
        width: 99%;
        line-height: 40px;
        height: 40px;
        font-size: 14px;
        background: #eee;
      }
    }
  }
</style>
