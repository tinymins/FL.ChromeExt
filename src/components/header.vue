<template>
  <header>
    <div class="nav-wrapper">
      <div class="nav">
        <el-menu class="nav-menu" :default-active="selected" mode="horizontal" router>
          <el-menu-item
            v-for="(tab, index) of tabList" :key="tab.route"
            :index="tab.route"
            :route="{ name: tab.route }"
          >
            <router-link style="text-decoration: none" :to="tab.route">{{ tab.name }}</router-link>
          </el-menu-item>
        </el-menu>
        <div class="nav-user">{{ user ? user.name : '请先登录' }}</div>
      </div>
    </div>
  </header>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { Menu, MenuItem } from 'element-ui';

  export default {
    components: {
      [Menu.name]: Menu,
      [MenuItem.name]: MenuItem,
    },
    asyncData({ store }) {
      return store.dispatch('user/USER_GET');
    },
    methods: {},
    data() {
      const tabList = [
        { name: '用户中心', route: 'user' },
        { name: '超级排序', route: 'csort' },
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
          let active = this.$route.name;
          Object.values(this.$route.matched).forEach((obj) => {
            if (obj.meta.parent) {
              active = obj.meta.parent;
            }
          });
          return active;
        },
      },
    },
  };
</script>

<style lang="scss" scoped>
.nav-wrapper {
  background-color: #eef1f6;
}
.nav {
  display: flex;
  margin: 0 auto;
  max-width: 960px;
  &-menu {
    flex:1;
  }
  &-user {
    font-size: 20px;
    line-height: 60px;
    margin-right: 20px;
  }
}
</style>
