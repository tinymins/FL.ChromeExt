<template>
  <div class="menu">
    <el-button @click="popupCsort" type="primary" class="menu-item">超级排序</el-button>
  </div>
</template>
<script>
import { popupWindow } from '@/utils/util';
import { Button } from 'element-ui';

export default {
  components: {
    [Button.name]: Button,
  },
  methods: {
    popupCsort() {
      popupWindow('index.html#/csort', true);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../styles/views/popup/index.scss';
</style>
