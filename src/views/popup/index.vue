<template>
  <div class="menu">
    <template v-if="mounted">
      <el-button type="primary" class="menu-item" @click="popupCsort">超级排序</el-button>
      <el-button type="primary" class="menu-item" @click="popupTsellRealtime">实时榜单</el-button>
      <el-button type="primary" class="menu-item" @click="popupTsellCategory">分类榜单</el-button>
    </template>
  </div>
</template>
<script>
import { Button } from 'element-ui';
import { popupWindow } from '@/utils/chrome-ext';

export default {
  components: {
    [Button.name]: Button,
  },
  data() {
    return {
      mounted: false,
    };
  },
  mounted() {
    window.addEventListener('resize', this.startRender);
    this.timerRender = window.setTimeout(this.startRender, 50);
  },
  methods: {
    popupCsort() {
      popupWindow('index.html#/csort', true);
    },
    popupTsellRealtime() {
      popupWindow('index.html#/tsell/realtime', true);
    },
    popupTsellCategory() {
      popupWindow('index.html#/tsell/category', true);
    },
    startRender() {
      if (this.timerRender) {
        clearTimeout(this.timerRender);
        delete this.timerRender;
      }
      this.mounted = true;
      window.removeEventListener('resize', this.onMounted);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~styles/views/popup/index.scss';
</style>
