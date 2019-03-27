<template>
  <header>
    <div class="nav-wrapper">
      <div class="nav">
        <el-menu :default-active="selected" class="nav-menu" mode="horizontal" router>
          <el-menu-item
            v-for="(tab, index) of tabList" :key="index"
            :index="tab.route"
            :route="{ name: tab.route }"
          >
            <router-link :to="tab.route" style="text-decoration: none;">{{ tab.name }}</router-link>
          </el-menu-item>
        </el-menu>
        <div class="nav-user">
          <span>{{ user ? user.name : '请先登录' }}</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { mapGetters } from 'vuex';
import { Menu, MenuItem } from 'element-ui';
import { USER } from '@/store/types';

export default {
  components: {
    [Menu.name]: Menu,
    [MenuItem.name]: MenuItem,
  },
  asyncData({ store }) {
    return store.dispatch(`user/${USER.GET}`);
  },
  data() {
    const tabList = [
      { name: '用户中心', route: 'user' },
      { name: '超级排序', route: 'csort' },
      { name: '实时榜单', route: 'tsell' },
    ];
    return {
      tabList,
    };
  },
  computed: {
    ...mapGetters('user', ['user']),
    selected: {
      set(name) {
        this.$router.push({ name });
      },
      get() {
        let name = this.$route.name;
        Object.values(this.$route.matched).forEach((r) => {
          if (r.meta.tabbar) {
            name = r.meta.tabbar.replace(/[^/]+\//u, '');
          }
        });
        return name;
      },
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~styles/views/common/header/index.scss';
</style>
