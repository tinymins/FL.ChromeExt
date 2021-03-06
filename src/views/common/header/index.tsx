/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import { Menu, Submenu, MenuItem } from 'element-ui';
import { VNode } from 'vue';
import { namespace } from 'vuex-class';
import { Vue, Component } from 'vue-property-decorator';
import { USER } from '@/store/types';
import { StoreUserGetters } from '@/store/user';
import { getTabbarData, TabbarItemData, TabbarSubItemData } from '@/router/tabbars';
import styles from '@/styles/views/common/header/index.module.scss';

Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);

const userModule = namespace('user');

@Component
export default class HeaderView extends Vue {
  @userModule.Getter private readonly user!: StoreUserGetters['user'];

  private get tabbarData(): TabbarItemData[] {
    return getTabbarData(this.$route);
  }

  private get selected(): string {
    let name = this.$route.name as string;
    Object.values(this.$route.matched).forEach((r) => {
      if (r.meta.tabbar) {
        name = r.meta.tabbar.replace(/[^/]+\//u, '');
      }
    });
    return name;
  }

  private set selected(selected: string) {
    this.$router.push({ name: selected });
  }

  private get tabbarSel(): TabbarSubItemData[] {
    return this.tabbarData.map((sub) => {
      if (sub.route && sub.route.name === this.$routeInfo.name) {
        return sub;
      }
      if (sub.children) {
        const child = sub.children.find(tab => tab.route && tab.route.name === this.$route.name);
        if (child) {
          return child;
        }
        return sub.children[0];
      }
      return sub;
    });
  }

  private onUserClick(): void {
    if (this.user) {
      this.$router.push({ name: 'user' });
    } else {
      this.$router.push({ name: 'user_login', query: { redirect: this.$route.fullPath } });
    }
  }

  protected asyncData({ store }): Promise<void> {
    return store.dispatch(`user/${USER.GET}`);
  }

  public render(): VNode {
    return <header>
      <div class={styles['nav-wrapper']}>
        <div class={styles.nav}>
          <el-menu default-active={this.selected} class={styles['nav-menu']} mode="horizontal" router>
            {
              this.tabbarData.map((sub, i) => {
                if (sub.children && sub.children.length > 1) {
                  return <el-submenu index={`${i}`}>
                    <span slot="title">{ this.tabbarSel[i].text }</span>
                    {
                      sub.children.map(tab => <el-menu-item index={tab.name} route={tab.route}>{ tab.text }</el-menu-item>)
                    }
                  </el-submenu>;
                }
                return <el-menu-item index={sub.name} route={sub.route}>{ sub.text }</el-menu-item>;
              })
            }
          </el-menu>
          <div class={styles['nav-user']} onClick={this.onUserClick}>
            <span>{ this.user ? this.user.name : '请先登录' }</span>
          </div>
        </div>
      </div>
    </header>;
  }
}
