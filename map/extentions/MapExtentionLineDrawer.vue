<script lang="ts">
import {defineComponent, h, nextTick, onMounted, onUnmounted, Ref, ref, toRef, watch} from "vue";
import {LMarker, LIcon} from "@vue-leaflet/vue-leaflet"
import MapLine from "@/custom/map/MapLine.vue";
import {buildEmitter} from "@/custom/map/utils/emitter";
import {ContextMenuService} from "@/custom/components/ContextMenuService";
import Swal from "sweetalert2/dist/sweetalert2.js";

interface LineInfo {
  strokeColor: string;
  innerColor?: string;
  lines: Array<Array<number>>;
}

class DotDrawer {

  ld: LineDrawer;

  get lines() {
    return this.ld.lines;
  }

  set lines(value) {
    this.ld.lines = value;
  }

  constructor(lineDrawer: LineDrawer) {
    this.ld = lineDrawer;
  }

  removeItem(index) {
    if (this.lines.length > 2) {
      if (index == 0) {
        this.ld.setActiveInput(1);
      } else {
        this.ld.setActiveInput(index - 1);
      }
    } else if (this.lines.length == 2) {
      if (index == 0) {
        this.ld.setActiveInput(1);
      } else {
        this.ld.setActiveInput(0);
      }
    }

    if (this.lines.length > 1)
      this.ld.mapToolsWindowLine.orderedList.remove(index);
    else {
      Swal.fire({
        icon: 'warning',
        title: 'آیا مطمئن هستید ؟',
        text: 'به این عمل کل خط حذف میشود',
        showCancelButton: true,
        confirmButtonText: 'بله',
        cancelButtonText: `خیر`,
      }).then((e) => {
        if (e.isConfirmed) {
          this.ld.removeLineKey(this.ld.currentKey);

          this.ld.icons.value = {};
          this.ld.layers.value = {};

          this.ld.closeActiveWindow();
        }
      });
    }
    this.lines = this.ld.mapToolsWindowLine.orderedList.orderedList();
    nextTick(() => {
      this.ld.forceUpdateMapLinesData();
    });
  }

  private onContextMenu(contextMenuEvent: any, index: number) {
    if (contextMenuEvent.originalEvent) {
      if (!contextMenuEvent.originalEvent._alreadyFilled) {
        contextMenuEvent.originalEvent._alreadyFilled = true;
        ContextMenuService.set([
          {
            text: "اضافه کردن نقطه",
            onClick: () => {
              this.ld.mapToolsWindowLine.orderedList.addAfter('', index);

              this.ld.forceUpdateMapLinesData();
            }
          },
          {
            text: "حذف",
            onClick: () => {
              this.removeItem(index);
            }
          },
        ]);
      }
    } else {
      ContextMenuService.set([]);
    }
  }

  private async onClick(index) {
    // this.ld.openDefaultWindow();
    const element = this.ld.mapToolsWindowLineRaw.el.querySelector(`.custom-index-class-${index}`);
    if (element)
      element.focus();
  }

  drawDots() {
    this.ld.lines.forEach((latLng: Array<number>, index: number) => {
      const _key = `${latLng[0]},${latLng[1]}`;

      const marker = h(LMarker, {
        // add index to avoid collision on updates
        key: _key + '-' + index,
        latLng: latLng,
        onContextmenu: (contextMenuEvent) => {
          this.onContextMenu(contextMenuEvent, index);
        },
        onClick: () => {
          this.onClick(index)
        }
      }, h(LIcon, {
        iconUrl: '/media/icons/duotune/abstract/abs050.svg',
        iconSize: [25, 25]
      }));

      this.ld.icons.value[_key] = marker;
    })

    // remove non-existing ones
    Object.keys(this.ld.icons.value).filter((_key) => {
      const s = _key.split(',');
      return this.lines.findIndex((item) => {
        return item[0] == Number(s[0]) && item[1] == Number(s[1])
      }) == -1;
    }).forEach((_key) => {
      delete this.ld.icons.value[_key];
    });
  }

}

class LineDrawer {

  dotDrawer: DotDrawer;

  props: any;
  context: any;

  _lines: Ref<Record<string, LineInfo>>;
  currentKey = '';
  activeIndex = '';

  icons: Ref<Record<string, any>> = ref({});
  layers: Ref<Record<string, any>> = ref({});

  constructor(props, context, lines: Ref<Record<string, LineInfo>>) {
    this.props = props;
    this.context = context;
    this._lines = lines;
    this.dotDrawer = new DotDrawer(this);
  }

  clear() {
      this.icons.value = {};
      this.layers.value = {};
      this.activeIndex = '';
      this.currentKey = '';
  }

  get lines() {
    return this._lines.value[this.currentKey].lines;
  }

  set lines(value) {
    this._lines.value[this.currentKey].lines = value;
  }

  get mapComponent() {
    return this.props.plugins.getMain();
  }

  get mapToolsWindowLine() {
    return this.props.plugins.get('MapToolsWindowLine').proxy;
  }

  get mapToolsWindowLineRaw() {
    return this.props.plugins.getRaw('MapToolsWindowLine');
  }

  setActiveInput(index) {
    const element = this.mapToolsWindowLineRaw.el.querySelector(`.custom-index-class-${index}`);
    if (element)
      element.focus();
  }

  removeLineKey(key) {
    if (this._lines[key])
      delete this._lines[key];
  }

  closeActiveWindow() {
    this.mapComponent.proxy.activeWindow = undefined;
  }

  forceUpdateMapLinesData() {
    this.mapToolsWindowLine.emitTo(
        'updateData',
        [this.mapToolsWindowLine.orderedList.orderedList()]
    );
  }

  onMapToolsWindowEvent() {

    const ad = (s) => {
      return s + (s > 0 ? -0.25 : 0.25)
    }

    return (name, event) => {
      let _index = -1;
      switch (name) {
        case "focusin":
          this.activeIndex = _index = event[0];
          this.layers.value['marker'] = h(LMarker, {
            draggable: true,
            'onUpdate:latLng': (e) => {
              this.lines[_index] = [e.lat, e.lng];
              this.mapToolsWindowLine.orderedList.setInitial(this.lines);
              this.dotDrawer.drawDots();
            },
            key: `${this.lines[_index][0]}${this.lines[_index][1]}`,
            latLng: this.lines[_index]
          });
          break;
        case "update":
          _index = event[0];

          if (this.lines[_index] != event[1])
            this.lines[_index] = event[1];

          this.dotDrawer.drawDots();
          break;
        case "updateData":
          var index = event[0].indexOf('' as any);
          if (index > -1) {
            if (event[0].length > 2) {
              if (index == 0) {
                event[0][0] = [ad(event[0][1][0]), ad(event[0][1][1])]
                nextTick(() => {
                  this.setActiveInput(0);
                });
              } else if (index == event[0].length - 1) {
                var fo = event[0].length - 2;
                event[0][event[0].length - 1] = [ad(event[0][fo][0]), ad(event[0][fo][1])]
                nextTick(() => {
                  this.setActiveInput(event[0].length - 1);
                })
              } else {
                event[0][index] = [ad(event[0][index + 1][0]), ad(event[0][index + 1][1])]
                nextTick(() => {
                  this.setActiveInput(index);
                })
              }
            } else if (event[0].length == 2) {
              if (index == 0) {
                event[0][0] = [ad(event[0][1][0]), ad(event[0][1][1])]
                nextTick(() => {
                  this.setActiveInput(0);
                })
              } else if (index == 1) {
                event[0][1] = [ad(event[0][0][0]), ad(event[0][0][1])]
                nextTick(() => {
                  this.setActiveInput(1);
                })
              }
            } else {
              event[0][0] = this.props.plugins.get('LMap').proxy.center;
              nextTick(() => {
                this.setActiveInput(0);
              })
            }
          }
          this.lines = event[0];

          this.mapToolsWindowLine.orderedList.setInitial(this.lines);
          this.dotDrawer.drawDots();

          // if (event[0].indexOf('') > -1)
          // lines.value[currentKey.value].lines = event[0];
          // props.plugins.getMain().proxy.emitsTo['MapExtensionLineDrawer'] = (name, event) => {
          //   if (name == 'mousemove') {
          //     if (event.originalEvent)
          //       console.log(name, [event.latlng.lat, event.latlng.lng]);
          //   }
          // }

          break;
      }
    }
  }

  setLineDataOnWindow() {
    this.mapToolsWindowLine.orderedList.setInitial(this.lines);
    this.mapToolsWindowLine.emitsTo['MapExtensionLineDrawer'] = this.onMapToolsWindowEvent();
  }

  openDefaultWindow(forceReset = false) {
    return new Promise<void>((finished) => {
      if (!this.mapComponent.proxy.activeWindow) {
        this.mapComponent.proxy.activeWindow = 'default-windows';
        nextTick(() => {
          console.log("showing data using nextTick", this.lines);
          this.setLineDataOnWindow();
          this.dotDrawer.drawDots();
          finished();
        });
      } else {
        if (forceReset) {
          console.log("showing data using forceReset", this.lines);
          this.setLineDataOnWindow();
          this.dotDrawer.drawDots();
        }
        finished();
      }
    });
  }

}

export default defineComponent({
  name: "MapExtensionLineDrawer",
  props: {
    plugins: {
      type: Object,
      required: true
    }
  },
  setup(props, context) {
    const {emitTo, emitsTo} = buildEmitter();
    const activeWindow = toRef(props.plugins.getMain().proxy, 'activeWindow');

    /**
     * hold a set of unique lines which are shown
     * to user
     */
    const lines: Ref<Record<string, LineInfo>> = ref({
      "line-1": {
        strokeColor: "#000",
        lines: [
          [35.632744348010625, 51.43146514892579],
          [35.55010533588552, 51.22650146484375],
          [35.18278813800229, 50.86395263671875],
        ],
      },
      "line-2": {
        strokeColor: "#000",
        lines: [
          [35.632744348010625, 51.43146514892575],
          [35.55010533588552, 51.22650146484379],
          [35.18278813800229, 50.96395263671875],
        ],
      },
    });

    const lineDrawer = new LineDrawer(props, context, lines);

    const extraLayers: Ref<Record<string, any>> = lineDrawer.layers;
    const dots: Ref<Record<string, any>> = lineDrawer.icons;

    watch(activeWindow, (e) => {
      if (!e) {
        lineDrawer.clear();
      }
    })

    const sumOfLines = (points: Array<Array<number>>) => {
      let sum = '';
      for (let i = 0; i < Math.min(points.length, 5); i++) {
        sum += `${points[i][0]}${points[i][1]}`;
      }
      return sum;
    }

    const buildLine = (key) => {
      const line = lines.value[key];

      return h(MapLine, {
        strokeColor: line['strokeColor'], lines: line.lines, key: sumOfLines(line.lines), onEdit: () => {
          lineDrawer.icons.value = {};
          lineDrawer.layers.value = {};
          lineDrawer.currentKey = key;
          lineDrawer.activeIndex = '';
          lineDrawer.openDefaultWindow(true);
        }
      });

    }

    const globalKeyDown = (e) => {
      if (e.code == 'Escape') {
        delete extraLayers.value['marker'];
        const element = (document.querySelector('input:focus') as any);
        if (element)
          element?.blur();
      }
      if (e.code == 'Delete') {
        if (!extraLayers.value['marker'])
          return;

        lineDrawer.dotDrawer.removeItem(lineDrawer.activeIndex);
        delete extraLayers.value['marker'];
      }
    }

    onMounted(() => {
      document.addEventListener('keydown', globalKeyDown);
    })

    onUnmounted(() => {
      document.removeEventListener('keydown', globalKeyDown);
    })


    return {
      // data
      emitsTo,
      lines,
      dots,
      extraLayers,

      // functions
      emitTo,
      buildLine,
    }
  },
  render() {
    return h('div', {}, {
      default: () => {
        return [
          ...Object.values(this.extraLayers),
          ...Object.keys(this.lines).map(this.buildLine),
          ...Object.values(this.dots),
        ];
      }
    });
  }
});
</script>