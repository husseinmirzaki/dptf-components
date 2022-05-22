<template>
  <info-card class="text-center">
    <!--End : Effect to Number-->
    <div dir="ltr" class="d-flex justify-content-center align-content-center">
      <div class="numbers" style="color: #FFFFFF">
        <span>{{ $attrs['number'] }}</span>
      </div>
    </div>
    <!-- Start : Effect to Number -->
  </info-card>
</template>
<script>
import InfoCard from "@/custom/widgets/InfoCard";
export default {
  components: {InfoCard}
}
</script>