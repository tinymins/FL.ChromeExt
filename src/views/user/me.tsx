/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import { Button } from 'element-ui';
import { VNode } from 'vue';
import { Component, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import Option from '@/decorators/option';
import { USER } from '@/store/types';
import { StoreUserGetters } from '@/store/user';
import XButton from '@/components/x-button';
import styles from '@/styles/views/user/me.module.scss';

const userModule = namespace('user');

Vue.use(Button);

@Component
export default class UserMePage extends Vue {
  @Option(true) protected static hideTabbar;

  @userModule.Getter private readonly user!: StoreUserGetters['user'];
  @userModule.Action(USER.GET) private getUser;
  @userModule.Action(USER.LOGOUT) private apiLogout;

  private logout(): void {
    this.apiLogout().then(() => {
      this.getUser().then(() => {
        if (this.$routeInfo.query.redirect) {
          this.$router.push({ path: this.$routeInfo.query.redirect });
        } else {
          this.$router.push({ name: 'user_login' });
        }
      });
    });
  }

  public render(): VNode {
    return <div class={styles.main}>
      {
        this.user
          ? <p>
            当前用户：{ this.user.name }
          </p>
          : null
      }
      <router-link to={{ name: 'user_login_dev' }}>Login Dev</router-link>
      <div class={styles.buttons}>
        <XButton class={styles.button} danger on={{ click: this.logout }}>登出</XButton>
      </div>
      <div class="wrapper">
        <el-button type="primary" onClick={this.logout}>登出</el-button>
      </div>
    </div>;
  }
}
