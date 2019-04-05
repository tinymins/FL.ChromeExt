<template>
  <div class="menu">
    <el-button type="primary" class="menu-item" @click="popupCsort">超级排序</el-button>
    <el-button type="primary" class="menu-item" @click="popupTsellTops">实时榜单</el-button>
    <el-button type="primary" class="menu-item" @click="popupTsellCategory">分类榜单</el-button>
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
    popupTsellTops() {
      popupWindow('index.html#/tsell/tops', true);
    },
    popupTsellCategory() {
      popupWindow('index.html#/tsell/category', true);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~styles/views/popup/index.scss';
</style>
