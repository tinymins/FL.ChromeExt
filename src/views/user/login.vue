<template>
  <div>
    <el-form class="login" ref="form" :model="form" label-width="80px">
      <el-form-item label=" 用户名">
        <el-input v-model="form.account"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" :disabled="!form.account || !form.password">登录</el-button>
      </el-form-item>
      <el-form-item>
        <el-alert
          :title="statusMsg"
          :type="success ? 'success' : 'error'"
          show-icon
          :closable="false"
          v-show="statusMsg"
        >
        </el-alert>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { mapActions } from 'vuex';
import { Input, Button, Form, FormItem, Alert } from 'element-ui';

export default {
  components: {
    [Input.name]: Input,
    [Button.name]: Button,
    [Form.name]: Form,
    [FormItem.name]: FormItem,
    [Alert.name]: Alert,
  },
  data() {
    return {
      form: {
        account: '',
        password: '',
      },
      success: false,
      statusMsg: '',
    };
  },
  methods: {
    ...mapActions('user', {
      login: 'USER_LOGIN',
      getUser: 'USER_GET',
    }),
    onSubmit() {
      this.login({
        account: this.form.account,
        password: this.form.password,
      }).then(() => {
        this.getUser().then(() => {
          if (this.$route.query.redirect) {
            this.$router.push({ path: this.$route.query.redirect });
          } else {
            this.$router.push({ name: 'user_index' });
          }
        });
        this.success = true;
        this.statusMsg = '登录成功';
      }).catch((errMsg) => {
        this.success = false;
        this.statusMsg = errMsg.toString();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../styles/views/user/login.scss';
</style>
