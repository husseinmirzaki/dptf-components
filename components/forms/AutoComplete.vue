<template>
  <div class="parent custom-auto-complete" :class="{focus: isFocused}">
    <input
        class="form-control"
        type="text"
        :value="fieldText"
        :placeholder="placeholder"
        @keyup="fieldData = $event.target.value"
        @keyup.down="oneDown"
        @keyup.up="oneUp"
        @keyup.enter="selectOne"
        @keyup.esc="isFocused=false"
        @focusin="isFocused=true">
    <div class="item-viewer" ref="itemContainer">
      <div class="item" v-for="info in data" :key="info.id" :data-id="info.id"
           @click="$event.target.classList.add('active');selectOne()">
        {{ info.text }}
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@keyframes opacity-animation {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.parent {
  position: relative;

  &.focus {
    > input {
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
    }

    > .item-viewer {
      animation: 250ms ease-in-out opacity-animation;
      display: flex;
      border-color: #B5B5C3;
    }
  }
}

.item-viewer {
  display: none;
  position: absolute;
  width: 100%;
  z-index: 1000;
  top: 100%;
  flex-direction: column;
  background-color: #fff;
  border: 1px solid #E4E6EF;
  border-top: none;
  box-shadow: inset 0 -1px 2px rgb(0 0 0 / 8%);
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  .item {
    text-align: justify;
    padding: 4px;
    font-size: 14px;
    background-color: #fff;
    transition: background-color 120ms ease-in-out;

    &:hover, &.active {
      background-color: #e8e8e8;
    }
  }
}
</style>
<script lang="ts">
import {onBeforeUnmount, onMounted, Ref, ref, toRef, watch} from "vue";
import {ApiService} from "@/Defaults";
import {findClassInParent} from "@/custom/helpers/DomHelpers";

interface AutoCompleteOptions {
  url?: string;
}

interface AutoCompleteData {
  id: number;
  text: string;
}

interface AutoCompleteResults {
  results: Array<AutoCompleteData>;
}

export default {
  props: ['modeValue', 'options', 'placeholder'],
  setup(props, context) {
    const options = toRef(props, 'options');
    const modeValue = toRef(props, 'modeValue');

    let textValue = "";
    let textText = "";

    if (typeof modeValue.value === "string") {
      textValue = modeValue.value;
      textText = modeValue.value;
    } else if (typeof modeValue.value === "object") {
      textValue = modeValue.value.id;
      textText = modeValue.value.text;
    }

    const fieldText: Ref<string> = ref(textText);
    const fieldData: Ref<string> = ref(textText);
    const inputDate: Ref<string> = ref(textValue);

    const defaultOptions: Ref<AutoCompleteOptions> = ref({});
    const isFocused = ref(false);
    const itemContainer = ref();
    const data: Ref<Array<AutoCompleteData>> = ref([]);

    let changeTriggerTimeout: any;

    Object.assign(defaultOptions.value, options.value)

    const sendInformation = (text) => {
      if (defaultOptions.value.url) {
        const textData = new URLSearchParams({search: text});
        let url = defaultOptions.value.url;

        if (url.search(/\?/) == -1) {
          url += "?" + textData;
        } else if (url.search(/\?/)) {
          url += "&" + textData;
        }

        ApiService.get<AutoCompleteResults>(url).then(({data: info}) => {
          data.value.splice(0);
          data.value.push(...info.results);
        });
      }
    }

    const selectOne = () => {
      if (itemContainer.value) {
        const activeOne = itemContainer.value.querySelector('.active');
        if (activeOne) {
          inputDate.value = activeOne.getAttribute('data-id');
          fieldText.value = activeOne.textContent;
          context.emit('update:modelValue', inputDate.value);
        }
      }
      isFocused.value = false;
    }

    const oneDown = () => {
      if (itemContainer.value) {
        const activeOne = itemContainer.value.querySelector('.active')
        if (activeOne) {
          activeOne.classList.remove('active');
          if (activeOne.nextElementSibling)
            activeOne.nextElementSibling.classList.add('active');
        } else {
          if (itemContainer.value.children.length > 0)
            itemContainer.value.children[0].classList.add('active');
        }
      }
    }

    const oneUp = () => {
      if (itemContainer.value) {
        const activeOne = itemContainer.value.querySelector('.active')
        if (activeOne) {
          activeOne.classList.remove('active');
          if (activeOne.previousElementSibling)
            activeOne.previousElementSibling.classList.add('active');
        } else {
          if (itemContainer.value.children.length > 0)
            itemContainer.value.children[0].classList.add('active');
        }
      }
    }

    watch(isFocused, (e) => {
      if (e) {
        sendInformation(fieldData.value);
      }
    })

    watch(fieldData, (textData) => {
      inputDate.value = textData;
      fieldText.value = textData;
      context.emit('update:modelValue', inputDate.value);

      clearTimeout(changeTriggerTimeout);
      changeTriggerTimeout = setTimeout(() => {
        sendInformation(textData);
      }, 200);
    });

    const globalOnClick = (e) => {
      if (!findClassInParent(e.target, 'custom-auto-complete')) {
        isFocused.value = false;
      }
    }

    onMounted(() => {
      document.addEventListener('click', globalOnClick);
    })

    onBeforeUnmount(() => {
      document.removeEventListener('click', globalOnClick);
    })

    return {
      // data
      fieldText,
      fieldData,
      inputDate,
      isFocused,
      data,

      // refs
      itemContainer,

      // methods
      oneUp,
      oneDown,
      selectOne,
    }
  },
}
</script>