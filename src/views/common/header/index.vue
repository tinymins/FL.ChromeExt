<template>
  <header>
    <div class="nav-wrapper">
      <div class="nav">
        <el-menu :default-active="selected" class="nav-menu" mode="horizontal" router>
          <template v-for="(tabs, i) of tabsList">
            <el-menu-item v-if="tabs.length === 1" :key="i" :index="tabs[0].name" :route="tabs[0].route">
              <div>{{ tabs[0].label }}</div>
            </el-menu-item>
            <el-submenu v-else :key="i" :index="`${i}`">
              <template slot="title">{{ tabsSel[i].label }}</template>
              <el-menu-item v-for="(tab, j) of tabs" :key="`${i}-${j}`" :index="tab.name" :route="tab.route">
                <div>{{ tab.label }}</div>
              </el-menu-item>
            </el-submenu>
          </template>
        </el-menu>
        <div class="nav-user" @click="onUserClick">
          <span>{{ user ? user.name : '请先登录' }}</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { mapGetters } from 'vuex';
import { Menu, Submenu, MenuItem } from 'element-ui';
import { USER } from '@/store/types';

export default {
  components: {
    [Menu.name]: Menu,
    [Submenu.name]: Submenu,
    [MenuItem.name]: MenuItem,
  },
  asyncData({ store }) {
    return store.dispatch(`user/${USER.GET}`);
  },
  data() {
    return {
      tabsList: [
        [{ name: 'user', label: '用户中心', route: { name: 'user' } }],
        [{ name: 'csort', label: '超级排序', route: { name: 'csort' } }],
        [
          { name: 'tsell_realtime', label: '实时榜单', route: { name: 'tsell_realtime' } },
          { name: 'tsell_category', label: '分类榜单', route: { name: 'tsell_category' } },
        ],
        // [{ name: 'coupon', label: '自动换券', route: { name: 'coupon' } }],
      ],
    };
  },
  computed: {
    ...mapGetters('user', ['user']),
    selected() {
      let name = this.$route.name;
      Object.values(this.$route.matched).forEach((r) => {
        if (r.meta.tabbar) {
          name = r.meta.tabbar.replace(/[^/]+\//u, '');
        }
      });
      return name;
    },
    tabsSel() {
      return this.tabsList.map(tabs => tabs.find(tab => tab.route.name === this.$route.name) || tabs[0]);
    },
  },
  methods: {
    onUserClick() {
      if (this.user) {
        this.$router.push({ name: 'user' });
      } else {
        this.$router.push({ name: 'user_login', query: { redirect: this.$route.fullPath } });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~styles/views/common/header/index.scss';
</style>
