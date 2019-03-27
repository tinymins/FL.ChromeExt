<template>
  <div>
    <el-form ref="form" class="login" :model="form" label-width="80px">
      <el-form-item label=" 用户名">
        <el-input v-model="form.account"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled="!form.account || !form.password" @click="onSubmit">登录</el-button>
      </el-form-item>
      <el-form-item>
        <el-alert
          v-show="statusMsg"
          :title="statusMsg"
          :type="success ? 'success' : 'error'"
          show-icon
          :closable="false"
        >
        </el-alert>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { mapActions } from 'vuex';
import { Input, Button, Form, FormItem, Alert } from 'element-ui';
import { USER } from '@/store/types';

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
      login: USER.LOGIN,
      getUser: USER.GET,
    }),
    onSubmit() {
      this.login({
        account: this.form.account,
        password: this.form.password,
      }).then(() => {
        this.success = true;
        this.statusMsg = '登录成功';
      }).catch((err) => {
        this.success = false;
        if (err && err.response && err.response.errmsg) {
          this.statusMsg = err.response.errmsg.toString();
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~styles/views/user/login.scss';
</style>
