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

@Component
export default class PopupPage extends Vue {
  private ready = false;
  private timerRender = 0;

  private popupCsort(): void {
    popupWindow('index.html#/csort', true);
  }

  private popupTsellRealtime(): void {
    popupWindow('index.html#/tsell/realtime', true);
  }

  private popupTsellCategory(): void {
    popupWindow('index.html#/tsell/category', true);
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
          ? [
            <el-button type="primary" class={styles['menu-item']} onClick={this.popupCsort}>超级排序</el-button>,
            <el-button type="primary" class={styles['menu-item']} onClick={this.popupTsellRealtime}>实时榜单</el-button>,
            <el-button type="primary" class={styles['menu-item']} onClick={this.popupTsellCategory}>分类榜单</el-button>,
          ]
          : null
      }
    </div>;
  }
}
