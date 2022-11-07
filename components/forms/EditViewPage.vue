<template>
  <StateManager :states="['view', 'edit']" ref="sMananger">
    <template #view>
      <SimpleReadOnlyFormOnline
        :class="$attrs.class"
        :disable-drag="true"
        :card-title="pageTitle"
        :disableTitle="disableTitle"
        :onFields="onFieldsRead"
        :onModes="onReadModes"
        :onBuildFields="onModalBuildFields"
        :onOrderField="onOrderRead"
        :onTableCreation="onReadTableCreation"
        :onFormReady="onFormReadyRead"
        :model-name="modelName"
        :show-edit-button="true"
        @edit="$refs.sMananger.activeState = 'edit'"
      />
    </template>
    <template #edit>
      <AddAbleFormOnline
        :class="$attrs.class"
        :card-title="pageTitle"
        :model-name="modelName"
        :onBuildFields="onBuildFields"
        :onModes="onModes"
        :onFields="onFieldsAdd"
        :onOrderField="onOrderAdd"
        :onFormReady="onFormReadyAdd"
        @cancel="$refs.sMananger.activeState = 'view'"
        @done="
          $refs.sMananger.activeState = 'view';
          $emit('done', $event);
        "
      />
    </template>
  </StateManager>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import AddAbleFormOnline from "@/custom/components/forms/AddAbleFormOnline.vue";
import SimpleReadOnlyFormOnline from "@/custom/components/forms/SimpleReadOnlyFormOnline.vue";
import StateManager from "@/custom/components/forms/StateManager.vue";

export default defineComponent({
  props: [
    "pageTitle",
    "modelName",
    "onFieldsRead",
    "onOrderRead",
    "onReadTableCreation",
    "onFormReadyRead",
    "disableTitle",
    "onFieldsAdd",
    "onOrderAdd",
    "onFormReadyAdd",
    "onBuildFields",
    "onModalBuildFields",
    "onReadBuildFields",
    "onModes",
    "onReadModes",
  ],
  components: { StateManager, SimpleReadOnlyFormOnline, AddAbleFormOnline },
});
</script>
