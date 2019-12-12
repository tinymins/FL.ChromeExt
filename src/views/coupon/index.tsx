/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import { Input, Button, Table, TableColumn, Alert, Select, Option } from 'element-ui';
import { VNode } from 'vue';
import { namespace } from 'vuex-class';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { COUPON } from '@/store/types';
import * as storage from '@/utils/storage';
import styles from '@/styles/views/coupon/index.module.scss';
import { AsyncDataParam } from '@/router';

const couponModule = namespace('coupon');

Vue.use(Input);
Vue.use(Button);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Alert);
Vue.use(Select);
Vue.use(Option);

@Component
export default class CoupunPage extends Vue {
  private fetching = false;
  private category = storage.getLocal('coupon:category') || '0';
  private taokeKey = storage.getLocal('coupon:taokeKey') || '';

  @couponModule.State private readonly list;
  @couponModule.State private readonly categoryList;

  @Watch('category')
  protected onCategoryChange(category): void {
    storage.setLocal('coupon:category', category);
  }

  @Watch('taokeKey')
  protected onTaokeKeyChange(taokeKey): void {
    storage.setLocal('coupon:taokeKey', taokeKey);
  }

  @couponModule.Action(COUPON.COUPON_GET_LIST) private getList;

  private getRowIcon(row): string {
    if (row.newCsort === '') {
      return 'circle-close';
    }
    if (row.csort === row.newCsort) {
      return 'circle-check';
    }
    return row.submitting ? 'loading' : '';
  }

  private fetch(): void {
    this.getList({ category: this.category });
  }

  private toggle(): void {}

  protected asyncData({ store }: AsyncDataParam): Promise<void[]> {
    const ps: Promise<void>[] = [];
    ps.push(store.dispatch(`coupon/${COUPON.GET_CATEGORY}`));
    return Promise.all(ps);
  }

  public render(): VNode {
    return <div class={styles.main}>
      <div class={styles.query}>
        <el-input
          v-model={this.taokeKey}
          type="input"
          placeholder="请输入淘客KEY"
        ></el-input>
        <el-select v-model={this.category} placeholder="请选择">
          {
            this.categoryList.map(item => <el-option
              label={item.label}
              value={item.value}
            ></el-option>)
          }
        </el-select>
        <el-button
          class={styles['submit-btn']}
          type="primary"
          disabled={this.fetching}
          onClick={this.fetch}
        >开始</el-button>
      </div>
      <div class={styles.list}>
        <el-table class={styles['list-table']} data={this.list}>
          <el-table-column label="商品名称" prop="title" sortable></el-table-column>
          <el-table-column label="旧券后价" prop="price" width="120" sortable></el-table-column>
          <el-table-column label="旧优惠券" prop="discount" width="120" sortable></el-table-column>
          <el-table-column label="新券后价" prop="finalPrice" width="120" sortable></el-table-column>
          <el-table-column label="新优惠券" prop="discount" width="120" sortable></el-table-column>
          <el-table-column label="操作" width="110" scopedSlots={{
            default: scope => <el-button
              type={scope.row.disabled ? 'success' : 'danger'}
              // onClick={() => this.toggle(scope.row)}
            >{ scope.row.disabled ? '启用' : '禁用' }</el-button>,
          }}>
          </el-table-column>
        </el-table>
      </div>
    </div>;
  }
}
