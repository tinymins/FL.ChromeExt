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
import { popupWindow } from '@/utils/chrome-ext';
import styles from '@/styles/views/popup/index.module.scss';

Vue.use(Button);

const POPUP_LIST = [
  { path: 'csort', text: '超级排序' },
  { path: 'tsell/realtime', text: '实时榜单' },
  { path: 'tsell/category', text: '分类榜单' },
];

@Component
export default class PopupPage extends Vue {
  private ready = false;
  private timerRender = 0;

  private popup(path): void {
    popupWindow(`index.html#/${path}`, true);
  }

  private startRender(): void {
    if (this.timerRender) {
      clearTimeout(this.timerRender);
      delete this.timerRender;
    }
    this.ready = true;
    window.removeEventListener('resize', this.startRender);
  }

  protected mounted(): void {
    window.addEventListener('resize', this.startRender);
    this.timerRender = window.setTimeout(this.startRender, 50);
  }

  public render(): VNode {
    return <div class={styles.menu}>
      {
        this.ready
          ? POPUP_LIST.map(item => <div class={styles['menu-item']}>
            <el-button class={styles['menu-item__btn']} type="primary" onClick={() => this.popup(item.path)}>{ item.text }</el-button>
          </div>)
          : null
      }
    </div>;
  }
}
