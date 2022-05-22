<template><div/></template>
<script>
import {toRefs, watch} from "vue";

export default {
  props: ['theRef', 'theKey', 'theValue'],
  setup(props) {
    const {theRef, theKey, theValue} = toRefs(props);
    watch(theValue, () => {
      theRef.value[theKey.value] = theValue.value;
    });
    theRef.value[theKey.value] = theValue.value;
  }
}
</script>