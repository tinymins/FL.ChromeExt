
/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import { Input, Button, Form, FormItem, Alert } from 'element-ui';
import { VNode } from 'vue';
import { namespace } from 'vuex-class';
import { Component, Vue } from 'vue-property-decorator';
import Option from '@/decorators/option';
import { USER } from '@/store/types';
import { getAuthorizeURL } from '@/utils/authorization';
import { isLocalhost, isInWechat } from '@/utils/environment';
import styles from '@/styles/views/user/login.module.scss';

Vue.use(Input);
Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Alert);

const userModule = namespace('user');

@Component
export default class LoginPage extends Vue {
  @Option(true) protected static hideTabbar;
  @Option(false) protected static bodyAutoHeight;

  private form = {
    account: '',
    password: '',
  };

  private success = false;
  private statusMsg = '';

  @userModule.Action(USER.LOGIN) private login;
  @userModule.Action(USER.GET) private getUser;

  private onSubmit(): void {
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
  }

  protected mounted(): void {
    const useWechatAuth = !isLocalhost() && isInWechat();
    if (useWechatAuth) {
      const to = this.$routeInfo.query.to
        ? this.$router.resolve(this.$routeInfo.query.to)
        : null;
      const redirect = getAuthorizeURL('wx', 'login', to);
      if (redirect) {
        window.location.href = redirect;
      }
    }
  }

  public render(): VNode {
    return <div>
      <el-form ref="form" class={styles.login} model={this.form} label-width="80px" onInput={() => {}}>
        <el-form-item label=" 用户名">
          <el-input v-model={this.form.account}></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model={this.form.password}></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" disabled={!this.form.account || !this.form.password} onClick={this.onSubmit}>登录</el-button>
        </el-form-item>
        <el-form-item>
          <el-alert
            v-show={this.statusMsg}
            title={this.statusMsg}
            type={this.success ? 'success' : 'error'}
            show-icon
            closable={false}
          >
          </el-alert>
        </el-form-item>
      </el-form>
    </div>;
  }
}
