<template>
  <div class="row justify-content-center align-items-center">
    <div class="items-row">
      <div class="item-container">
        <template v-if="!isEmpty">
          <DivTreeItem v-bind="item" v-for="item in modifiedStructure" :key="item"/>
        </template>
        <template v-else>
          <h2>شما به این بخش دسترسی ندارید</h2>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, ref, toRef} from "vue";
import DivTreeItem from "@/custom/components/div-tree/DivTreeItem.vue";
import {VueInstanceService} from "@/Defaults";

export default defineComponent({
  components: {DivTreeItem},
  props: ["structure"],
  setup(props) {
    const modifiedStructure = ref(props.structure);
    const isEmpty = ref(false);

    onMounted(()=> {
      const count = modifiedStructure.value.length;
      for (let i = 0; i < count; i++) {
        modifiedStructure.value[i].children = modifiedStructure.value[i].children.filter((child) => {
          const permissionName = VueInstanceService.router.resolve({name: child.routerName}).meta["permissionName"];

          console.log("permission_name", permissionName);
          if (permissionName) {
            if (!VueInstanceService.hasPermission(permissionName as any, (e) => e.startsWith("view_")))
              return false;
          }

          return true;
        });
        isEmpty.value = modifiedStructure.value[i].children.length == 0;
      }
    });

    return {
      modifiedStructure,
      isEmpty
    }
  }
});
</script>
<style>
/*
.multi-item-container when u have more than item-container in one container
 */
:root {
  --height: 30px;
}

.items-row {
  direction: ltr;
  margin-top: 10px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: start;
}

.items-row > .item-container {
  margin-left: 50px;
}

.items-row > .item-container:first-child {
  margin-left: 0;
}

.item-container {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.items-row .item-children {
  position: relative;
  margin-top: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: start;
}

.items-row .item-children.show-stuff:after {
  position: absolute;
  top: 0;
  left: 0;
  transform: translateX(50%) translateY(-100%);
  content: "";
  height: 20px;
  width: 100%;
  border-left: 1px solid black;
}

.items-row .item {
  cursor: pointer;
  /*user-select: none;*/
  direction: rtl;
  position: relative;
  min-width: 150px;
  min-height: 60px;
  background: red;
}

.items-row .show-stuff .item {
  margin-top: var(--height);
  margin-left: var(--height);
}

.items-row .show-stuff .item:after {
  content: "";
  position: absolute;
  transform: translateX(50%) translateY(-100%);
  width: 100%;
  top: 0;
  left: 0;

  height: var(--height);
  border-top: 1px solid black;
  border-left: 1px solid black;
}

.items-row .show-stuff .item:before {
  content: "";
  position: absolute;
  transform: translateY(-100%);
  width: 100%;
  top: 0;
  left: 0;

  height: var(--height);
  border-top: 1px solid black;
}

.items-row .show-stuff .item:first-child {
  margin-left: 0;
}

.items-row .show-stuff .item:first-child:before {
  border-top: 1px solid black;
  transform: translateX(50%) translateY(-100%);
}

.items-row .show-stuff.only-one .item:before, .items-row .show-stuff.only-one .item:after {
  display: none;
}

.items-row .show-stuff.only-one .item {
  margin-top: 0;
}

.items-row .show-stuff .item:last-child:after {
  border-right: 1px solid black;
  border-left: none;
  transform: translateX(-50%) translateY(-100%);
}

.items-row .show-stuff .item:last-child:before {
  border-right: 1px solid black;
  border-left: none;
  transform: translateX(-50%) translateY(-100%);
}

.item-container > .item:after {
  border-right: none !important;
  border-left: none !important;
  transform: translateX(-100%) translateY(-100%) !important;
}

.item-container > .item:before {
  border-right: 1px solid black;
  border-left: none !important;
  transform: translateX(-50%) translateY(-100%) !important;
}

.item-children .item-container:before {
  content: "";
  position: absolute;
  width: 50%;
  height: 100%;
  top: 0;
  left: 0;
  border-top: 1px black solid;
}

.item-children.multi-item-container .item-container {
  padding-left: 50px;
}

.item-children.multi-item-container .item-container:nth-child(2) {
  padding-left: 0;
}

.item-children.multi-item-container .item-container:before {
  width: 100%;
  transform: translateX(-50%);
}

.item-children.multi-item-container .item-container:nth-child(2):before {
  border-top: none !important;
}

.item-children:not(.show-stuff) > .item {
  margin-top: var(--height);
}

.item-children:not(.show-stuff) > .item:after {
  content: "";
  position: absolute;
  width: 50%;
  height: calc(var(--height) + 20px);
  top: calc((var(--height) + 20px) * -1);
  left: 0;
  border-right: 1px black solid;
}
</style>
