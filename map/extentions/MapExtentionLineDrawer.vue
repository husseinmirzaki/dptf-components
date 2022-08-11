<script lang="ts">
import {defineComponent, h, nextTick, onMounted, onUnmounted, Ref, ref, watch} from "vue";
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

export default defineComponent({
  name: "MapExtensionLineDrawer",
  props: {
    plugins: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const {emitTo, emitsTo} = buildEmitter();

    const extraLayers: Ref<Record<string, any>> = ref({});
    const dots: Ref<Record<string, any>> = ref({});
    const currentKey = ref();
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

    const drawDots = (_lines) => {
      _lines.forEach((e: Array<number>, index: number) => {
        const _key = `${e[0]},${e[1]}`;

        const marker = h(LMarker, {
          key: _key + '-' + index,
          latLng: e,
          onContextmenu: (e) => {
            if (e.originalEvent) {
              if (!e.originalEvent._alreadyFilled) {
                e.originalEvent._alreadyFilled = true;
                ContextMenuService.set([
                  {
                    text: "اضافه کردن نقطه",
                    onClick: () => {
                      props.plugins.get('MapToolsWindowLine').proxy.orderedList.addAfter('', index);

                      props.plugins.get('MapToolsWindowLine').proxy.emitTo(
                          'updateData',
                          [props.plugins.get('MapToolsWindowLine').proxy.orderedList.orderedList()]
                      );
                    }
                  },
                  {
                    text: "حذف",
                    onClick: () => {

                      if (_lines.length > 2) {
                        if (index == 0) {
                          setActiveInput(1);
                        } else {
                          setActiveInput(index - 1);
                        }
                      } else if (_lines.length == 2) {
                        if (index == 0) {
                          setActiveInput(1);
                        } else {
                          setActiveInput(0);
                        }
                      }

                      if (_lines.length > 1)
                        props.plugins.get('MapToolsWindowLine').proxy.orderedList.remove(index);
                      else {
                        Swal.fire('اخطار', 'توجه کنید با حذف این مورد کل خط حذف خواهد شد', 'danger')
                      }
                      lines.value[currentKey.value].lines = props.plugins.get('MapToolsWindowLine').proxy.orderedList.orderedList();
                      nextTick(() => {
                        props.plugins.get('MapToolsWindowLine').proxy.emitTo(
                            'updateData',
                            [props.plugins.get('MapToolsWindowLine').proxy.orderedList.orderedList()]
                        );
                      });
                    }
                  },
                ]);
              }
            } else {
              ContextMenuService.set([]);
            }
          },
          onClick: async (e) => {
            console.log(e.originalEvent);
            await openDefaultWindow(_lines);
            console.log(index);
            const defaultWindows = props.plugins.getRaw('MapToolsWindowLine');
            defaultWindows.el.querySelector(`.custom-index-class-${index}`).focus();
          }
        }, h(LIcon, {
          iconUrl: '/media/icons/duotune/abstract/abs050.svg',
          iconSize: [25, 25]
        }));

        dots.value[_key] = marker;
      })

      // remove non-existing ones
      Object.keys(dots.value).filter((_key) => {
        const s = _key.split(',');
        return _lines.findIndex((item) => {
          return item[0] == Number(s[0]) && item[1] == Number(s[1])
        }) == -1;
      }).forEach((_key) => {
        delete dots.value[_key];
      });
    }

    const setLineDataOnWindow = (lines) => {
      const defaultWindows = props.plugins.get('MapToolsWindowLine');
      defaultWindows.proxy.orderedList.setInitial(lines);
      defaultWindows.proxy.emitsTo['MapExtensionLineDrawer'] = onMapToolsWindowEvent();
    }

    const openDefaultWindow = (_lines, forceReset = false) => {
      return new Promise<void>((finished) => {
        const mapComponent = props.plugins.getMain();
        if (!mapComponent.proxy.activeWindow) {
          mapComponent.proxy.activeWindow = 'default-windows';
          nextTick(() => {
            setLineDataOnWindow(_lines);
            drawDots(lines.value[currentKey.value].lines);
            finished();
          });
        } else {
          if (forceReset) {
            setLineDataOnWindow(_lines);
          }
          drawDots(lines.value[currentKey.value].lines);
          finished();
        }
      });
    }

    const setActiveInput = (index) => {
      props.plugins.getRaw('MapToolsWindowLine').el.querySelector(`.custom-index-class-${index}`).focus();
    }

    const onMapToolsWindowEvent = () => {
      return (name, event) => {
        console.log(name, event);
        let _index = -1;
        switch (name) {
          case "focusin":
            var line = lines.value[currentKey.value].lines;
            _index = event[0];
            extraLayers.value['marker'] = h(LMarker, {
              draggable: true,
              'onUpdate:latLng': (e) => {
                lines.value[currentKey.value].lines[_index] = [e.lat, e.lng];
                const defaultWindows = props.plugins.get('MapToolsWindowLine');
                defaultWindows.proxy.orderedList.setInitial(lines.value[currentKey.value].lines);
                drawDots(lines.value[currentKey.value].lines);
              },
              key: `${line[_index][0]}${line[_index][1]}`,
              latLng: line[_index]
            });
            break;
          case "update":
            _index = event[0];

            if (lines.value[currentKey.value].lines[_index] != event[1])
              lines.value[currentKey.value].lines[_index] = event[1];
            drawDots(lines.value[currentKey.value].lines);

            break;
          case "updateData":
            var index = event[0].indexOf('' as any);
            if (index > -1) {
              if (event[0].length > 2) {
                if (index == 0) {
                  event[0][0] = [ad(event[0][1][0]), ad(event[0][1][1])]
                  nextTick(() => {
                    setActiveInput(0);
                  });
                } else if (index == event[0].length - 1) {
                  var fo = event[0].length - 2;
                  event[0][event[0].length - 1] = [ad(event[0][fo][0]), ad(event[0][fo][1])]
                  nextTick(() => {
                    setActiveInput(event[0].length - 1);
                  })
                } else {
                  event[0][index] = [ad(event[0][index + 1][0]), ad(event[0][index + 1][1])]
                  nextTick(() => {
                    setActiveInput(index);
                  })
                }
              } else if (event[0].length == 2) {
                if (index == 0) {
                  event[0][0] = [ad(event[0][1][0]), ad(event[0][1][1])]
                  nextTick(() => {
                    setActiveInput(0);
                  })
                } else if (index == 1) {
                  event[0][1] = [ad(event[0][0][0]), ad(event[0][0][1])]
                  nextTick(() => {
                    setActiveInput(1);
                  })
                }
              } else {
                event[0][0] = props.plugins.get('LMap').proxy.center;
                nextTick(() => {
                  setActiveInput(0);
                })
              }
            }
            lines.value[currentKey.value].lines = event[0];

            var defaultWindows = props.plugins.get('MapToolsWindowLine');
            defaultWindows.proxy.orderedList.setInitial(lines.value[currentKey.value].lines);
            drawDots(lines.value[currentKey.value].lines);
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

    const ad = (s) => {
      return s + (s > 0 ? -0.25 : 0.25)
    }

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
          dots.value = {};
          extraLayers.value = {};
          currentKey.value = key;
          openDefaultWindow(line.lines, true);
        }
      });

    }

    const buildLayers = (e) => {
      return extraLayers.value[e];
    }

    const buildDots = (e) => {
      return dots.value[e];
    }

    const globalKeyDown = (e) => {
      if (e.code == 'Escape') {
        delete extraLayers.value['marker'];
        (document.querySelector('input:focus') as any)?.blur();
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
      buildDots,
      buildLayers,
    }
  },
  render() {
    return h('div', {}, {
      default: () => {
        return [
          ...Object.keys(this.extraLayers).map(this.buildLayers),
          ...Object.keys(this.lines).map(this.buildLine),
          ...Object.keys(this.dots).map(this.buildDots),
        ];
      }
    });
  }
});
</script>