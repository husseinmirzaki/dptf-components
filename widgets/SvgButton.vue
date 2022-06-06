<template>
  <el-tooltip
        :content="content">
    <button
        class="btn btn-icon-dark btn-icon hover">
      <svg-icon>
        <slot/>
      </svg-icon>
    </button>
  </el-tooltip>

</template>
<script>
import SvgIcon from "@/custom/widgets/SvgIcon";

export default {
  props: ['content'],
  components: {SvgIcon},
  mounted() {
    //
  }
}
</script>