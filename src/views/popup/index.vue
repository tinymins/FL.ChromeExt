<template>
  <div class="menu">
    <el-button type="primary" class="menu-item" @click="popupCsort">超级排序</el-button>
    <el-button type="primary" class="menu-item" @click="popupTsell">实时榜单</el-button>
  </div>
</template>
<script>
import { popupWindow } from '@/utils/chrome-ext';
import { Button } from 'element-ui';

export default {
  components: {
    [Button.name]: Button,
  },
  methods: {
    popupCsort() {
      popupWindow('index.html#/csort', true);
    },
    popupTsell() {
      popupWindow('index.html#/tsell', true);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~styles/views/popup/index.scss';
</style>
