<template>
  <div class="wrapper">
    <el-button type="primary" @click="logout">登出</el-button>
  </div>
</template>
<script>
import { Button } from 'element-ui';
import { mapActions } from 'vuex';

export default {
  components: {
    [Button.name]: Button,
  },
  methods: {
    ...mapActions('user', {
      getUser: 'USER_GET',
      apiLogout: 'USER_LOGOUT',
    }),
    logout() {
      this.apiLogout().then(() => {
        this.getUser().then(() => {
          if (this.$route.query.redirect) {
            this.$router.push({ path: this.$route.query.redirect });
          } else {
            this.$router.push({ name: 'user_login' });
          }
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~styles/views/user/index.scss';
</style>
