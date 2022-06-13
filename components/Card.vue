<template>
  <slot name="card-body" v-if="disableCard">
    <slot name="card-content"/>
  </slot>
  <div v-else class="card d-flex" :class="{'draggable-start': mouseDown, 'h-100': fillHeight}" data-dragable="data-dragable" ref="cardRef"
       @mouseleave="mouseLeave">
    <slot name="card-header" :card-title="cardTitle" :card-description="cardDescription">
      <div class="card-header align-items-center border-bottom-1 border-dark mt-0 px-2"
           :dragable="disableDrag ? 'no': 'dragable'"
           @mousedown.stop="dragMouseDown"
           :class="[headerClasses, {'border-0': isCollapsed, 'border-bottom-1': !isCollapsed }]"
           v-if="$slots['card-header'] || cardTitle || cardDescription">
        <slot name="card-title-content">
          <h3 class="card-title align-items-start flex-column my-0">
            <slot name="card-title">
            <span class="fw-bolder mb-2 text-dark">
              <inline-svg :src="$props.icon"/>
              {{ cardTitle }}
            </span>
            </slot>

            <slot name="card-description">
            <span class="text-muted fw-bold fs-7 my-0">
              {{ cardDescription }}
            </span>
            </slot>

          </h3>
        </slot>

        <slot name="card-toolbar">
          <div class="card-toolbar my-0">
            <slot name="toolbar"/>
            <ul class="nav" v-if="navItems.length > 0">
              <li class="nav-item" v-for="item in navItems" :key="item">
                <a
                    @click.prevent="navItemSelected(item)"
                    class="
                nav-link
                btn btn-sm btn-color-muted btn-active btn-active-light-primary
                fw-bolder
                px-4
                me-1
              " :class="{'active': item === selectedNavItem}">
                  {{ item }}
                </a>
              </li>
            </ul>
            <slot name="toolbar0"/>
            <button
                v-if="$slots.dropDown"
                type="button" class="btn btn-icon btn-sm btn-active-color-primary"
                data-kt-menu-trigger="click"
                data-kt-menu-placement="bottom-start"
                data-kt-menu-flip="top-start">
                <span class="svg-icon svg-icon-info">
                    <inline-svg style="width:23px;height: 23px"
                                src="media/icons/duotune/general/gen022.svg"/>
                </span>
            </button>
            <slot name="dropDown"/>
            <slot name="toolbar1"/>
            <button type="button" class="btn btn-icon btn-sm btn-active-color-primary"
                    v-if="!disableDrag || enableCollapse"
                    @mousedown.stop="collapseToggle"
                    @click.stop="collapseToggle">
                <span class="svg-icon svg-icon-info">
                    <inline-svg style="width:23px;height: 23px"
                                :src="isCollapsed ? 'media/icons/duotune/general/gen035.svg': 'media/icons/duotune/general/gen036.svg'"/>
                </span>
            </button>
            <slot name="toolbar2"/>
            <!--            <button type="button" class="btn btn-icon btn-sm btn-active-color-primary">-->
            <!--                <span class="svg-icon svg-icon-info">-->
            <!--                    <inline-svg style="width:23px;height: 23px" src="media/icons/duotune/arrows/arr035.svg"/>-->
            <!--                </span>-->
            <!--            </button>-->
          </div>
        </slot>
      </div>
    </slot>
    <slot name="card-body">
      <div class="card-body" ref="bodyRef" :class="[bodyPaddingClass]">
        <slot name="card-content"/>
      </div>
    </slot>
    <div class="card-footer p-3" v-if="$slots['card-footer']">
      <slot name="card-footer"/>
    </div>
  </div>
</template>
<style scoped lang="scss">
.card-header[dragable="dragable"] {
  cursor: move;
}

.draggable-start {
  position: relative;

  &:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #ffffff;
  }
}

.card-title span:nth-child(1) {
  font-size: 15px
}

.card-header {
  min-height: 60px;
}
</style>
<script>
import CardMixin from "@/custom/mixins/CardMixin";
import {Collapse} from "bootstrap";
import {onMounted, onUnmounted, ref, toRef} from "vue";
import {MenuComponent} from "@/assets/ts/components";

export default {
  mixins: [CardMixin],
  props: {
    "navItems": {
      default: () => {
        return {};
      },
    },
    "disableCard": {
      default: false,
    },
    "disableDrag": {
      default: false,
    },
    "enableCollapse": {
      default: false,
    },
    "fillHeight": {
      default: true,
    },
    "icon": {
      default: "media/icons/duotune/maps/map008.svg",
    }
  },
  setup(props, context) {
    const cardRef = ref();
    const bodyRef = ref();
    const selectedNavItem = ref();
    const mouseDown = ref(false);
    const isCollapsed = ref(false);
    const disableCard = toRef(props, 'disableCard');
    const disableDrag = toRef(props, 'disableDrag');
    const enableCollapse = toRef(props, 'enableCollapse');

    let collapse;
    let clonedElement = null;
    let xDiff = 0;
    let yDiff = 0;
    let lastFoundElement = null;

    const navItemSelected = (e) => {
      if (selectedNavItem.value == e) {
        selectedNavItem.value = null;
      } else {
        selectedNavItem.value = e;
      }
      context.emit('selected-nav-item', selectedNavItem.value);
    }

    const collapseToggle = () => {
      // console.log("collapse");
      collapse.toggle();
      setTimeout(() => {
        isCollapsed.value = !bodyRef.value.classList.contains('show');
      }, 450)
    }

    const mouseLeave = () => {
      if (!mouseDown.value)
        cardRef.value.classList.remove("draggable-start");
    }

    const dragMouseDown = (e) => {

      if (disableDrag.value)
        return;

      if (!e.target.classList.contains('card-header'))
        return;

      mouseDown.value = true;

      const clone = cardRef.value.cloneNode(true);
      clonedElement = clone;

      clone.setAttribute('cloned-element', 'cloned-element');
      clone.style.position = 'fixed';


      const cardRect = cardRef.value.getBoundingClientRect();
      const clientRect = e.target.getBoundingClientRect();

      clone.style.top = cardRect.top + 'px';
      clone.style.left = cardRect.left + 'px';
      clone.style.width = cardRect.width + 'px';
      clone.style.height = cardRect.height + 'px';

      xDiff = clientRect.left - cardRect.left;
      yDiff = clientRect.top - cardRect.top;

      // console.log("clientRect", clientRect, "cardRect", cardRect);
      document.body.append(clone);
    }

    const dragMouseUp = (e) => {
      if (lastFoundElement) {
        const lastP = lastFoundElement.parentElement;
        const currP = cardRef.value.parentElement;
        currP.insertBefore(lastFoundElement, null);
        lastP.insertBefore(cardRef.value, null);
      }
      lastFoundElement = null;
      document.querySelectorAll('[cloned-element]').forEach((e) => {
        e.remove();
      });
      clonedElement = null;
      mouseDown.value = false;
      cardRef.value.classList.remove("draggable-start");
      // console.log(e);
    }

    const findDraggble = (target) => {

      if (target.hasAttribute('data-dragable'))
        return target;

      let parent = target.parentElement;

      if (parent.hasAttribute('data-dragable'))
        return parent;

      for (let i = 0; i < 50; i++) {
        if (parent && parent.hasAttribute('data-dragable')) {
          return parent;
        } else if (!parent) {
          return null;
        }

        parent = parent.parentElement;
      }
    }

    const mouseMove = (e) => {

      if (mouseDown.value) {

        if (clonedElement) {
          clonedElement.style.left = (e.x - xDiff) + 'px';
          clonedElement.style.top = (e.y - yDiff) + 'px';
        }

        const f = findDraggble(document.elementFromPoint(e.x - xDiff - 10, e.y - yDiff - 10));

        if (f === cardRef.value)
          return;

        if (f) {
          if (f !== lastFoundElement && lastFoundElement != null) {
            lastFoundElement.classList.remove('draggable-start');
          }
          lastFoundElement = f;
          f.classList.add('draggable-start');
        } else {
          if (lastFoundElement != null) {
            lastFoundElement.classList.remove('draggable-start');
          }
          lastFoundElement = null;
        }
      }
    }

    onUnmounted(() => {
      document.removeEventListener('mouseup', dragMouseUp);
      document.removeEventListener('mousemove', mouseMove);
    })

    onMounted(() => {
      if ((!disableCard.value && !disableDrag.value) || enableCollapse.value)
        collapse = new Collapse(cardRef.value.querySelector('.card-body'));
      if (!disableCard.value && !disableDrag.value) {
        document.addEventListener('mouseup', dragMouseUp);
        document.addEventListener('mousemove', mouseMove);
        MenuComponent.reinitialization();
        if (context.slots['card-body']) {
          // console.log("context.slots['card-body']", context)
        }

        let contains = false;
        cardRef.value.parentElement.classList.forEach((e) => {
          if (e.search('col-') > -1) {
            contains = true;
            return true;
          }
        });
        if (!contains) {
          console.warn("this card does not have a proper parent", cardRef.value);
        }

      }
    });

    return {
      dragMouseDown,
      collapseToggle,
      mouseLeave,
      navItemSelected,
      // data
      selectedNavItem,
      isCollapsed,
      cardRef,
      bodyRef,
      mouseDown,
    }

  }
};
</script>
