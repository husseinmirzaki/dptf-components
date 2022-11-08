<template>
  <div class="context-menu" ref="contextMenu">
    <ul>
      <li v-for="item in items" :key="item['text']">
        <div class="separator" v-if="item['text'] == 'separator'"></div>
        <div v-else class="menu-item d-flex flex-row align-items-center" @click="clicked(item)">
          <div class="menu-icon d-flex align-items-center justify-content-center">
            <span class="svg-icon svg-icon-1" v-if="item['icon'] || item['svgIcon']">
              <inline-svg :src="item['icon'] ? item['icon'] : item['svgIcon'].src"/>
            </span>
            <i v-if="item.faIcon" class="text-dark" :class="item.faIcon"></i>
          </div>
          <span class="text">{{ item['text'] }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>
<style lang="scss" scoped>
.context-menu {
  z-index: 9999;
  display: none;
  position: fixed;
  min-width: 150px;
  background-color: #fff9f9;
  border-radius: 3px;
  box-shadow: 1px 1px 7px -3px #0b0e18;

  ul {
    padding: 0;
    margin: 0;
    list-style-type: none;
  }

  .menu-item {
    &:hover {
      background-color: #e0e0e0;
    }

    .menu-icon {
      align-content: center;
      align-items: center;
      text-align: center;
      height: 27px;
      width: 27px;
      margin-left: 7px;
      background-color: #e0e0e0;
    }

    span.text {
      height: 20px;
      padding-left: 7px;
    }
  }
}
.separator {
  position: relative;
  height: 3px;
  background-image: linear-gradient(90deg, #ffffff, #f38211, #ff0000, #ff0000, #e0e0e0);
  width: 100%;
  margin: 2px 0 1px;
  border-radius: 5px;
  z-index: 9999999;
  box-shadow:0 0 4px 0 #0b0e18;
}
.menu-item {
  z-index: 1;
}


</style>
<script lang="ts">
import {defineComponent, onMounted, ref} from "vue";
import {ContextMenuItem, ContextMenuService} from "@/custom/components/ContextMenuService";

export default defineComponent({
  setup() {
    const contextMenu = ref();

    const clicked = (item: ContextMenuItem) => {
      if (item.onClick) {
        item.onClick(ContextMenuService.clickData);
      }
      hide();
    }

    const hide = () => {
      contextMenu.value.style.display = 'none';
    }

    const show = (_x, _y) => {
      let x = _x, y = _y;
      // const b = (contextMenu.value as HTMLElement).getBoundingClientRect();

      // console.log(x, y);

      contextMenu.value.style.left = `${x}px`
      contextMenu.value.style.top = `${y}px`
      contextMenu.value.style.display = 'block';
    }

    onMounted(() => {
      document.addEventListener('contextmenu', (e) => {
        if (contextMenu.value) {

          let element = e.target as HTMLElement | null;
          for (let i = 0; i < 10; i++) {
            if (!element)
              break;

            if (element == contextMenu.value) {
              e.preventDefault();
              return false;
            }

            if (element.getAttribute('data-context-menu')) {
              e.preventDefault();
              contextMenu.value.style.display = 'block';
              const x = e.clientX, y = e.clientY;
              show(x, y);
              return false;
            }

            if (element)
              element = element.parentElement;
          }


        }
        hide();
      })
      document.addEventListener('click', (e) => {
        if (contextMenu.value) {

          let element = e.target as HTMLElement | null;
          for (let i = 0; i < 10; i++) {
            if (!element)
              break;

            if (element == contextMenu.value) {
              return;
            }
            if (element)
              element = element.parentElement;
          }
          contextMenu.value.style.display = 'none';
        }
      });
    })
    return {
      clicked,
      show,
      hide,
      contextMenu,
      items: ContextMenuService.items
    }
  }
});
</script>