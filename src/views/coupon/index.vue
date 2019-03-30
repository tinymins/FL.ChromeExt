<template>
  <div class="main">
    <div class="query">
      <el-input
        v-model="taokeKey"
        type="input"
        placeholder="请输入淘客KEY"
      ></el-input>
      <el-select v-model="category" placeholder="请选择">
        <el-option
          v-for="item in categoryList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button
        class="submit-btn"
        type="primary"
        :disabled="fetching"
        @click="fetch"
      >开始</el-button>
    </div>
    <div class="list">
      <el-table class="list-table" :data="goods">
        <el-table-column label="商品名称" prop="title" sortable></el-table-column>
        <el-table-column label="旧券后价" prop="price" width="120" sortable></el-table-column>
        <el-table-column label="旧优惠券" prop="discount" width="120" sortable></el-table-column>
        <el-table-column label="新券后价" prop="finalPrice" width="120" sortable></el-table-column>
        <el-table-column label="新优惠券" prop="discount" width="120" sortable></el-table-column>
        <el-table-column label="操作" width="110">
          <template slot-scope="scope">
            <el-button
              :type="scope.row.disabled ? 'success' : 'danger'"
              @click="toggle(scope.row)"
            >{{ scope.row.disabled ? '启用' : '禁用' }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { Input, Button, Table, TableColumn, Alert, Select, Option } from 'element-ui';
import { mapState, mapActions } from 'vuex';
import { COUPON } from '@/store/types';
import * as storage from '@/utils/storage';

export default {
  components: {
    [Input.name]: Input,
    [Button.name]: Button,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Alert.name]: Alert,
    [Select.name]: Select,
    [Option.name]: Option,
  },
  asyncData({ store }) {
    const ps = [];
    ps.push(store.dispatch(`coupon/${COUPON.GET_CATEGORY}`));
    return ps;
  },
  data() {
    return {
      fetching: false,
      category: storage.getLocal('coupon:category') || '0',
      taokeKey: storage.getLocal('coupon:taokeKey') || '',
    };
  },
  computed: {
    ...mapState('coupon', ['list', 'categoryList']),
    goods() {
      return this.list;
    },
  },
  watch: {
    category(category) {
      storage.setLocal('coupon:category', category);
    },
    taokeKey(taokeKey) {
      storage.setLocal('coupon:taokeKey', taokeKey);
    },
  },
  methods: {
    ...mapActions('coupon', {
      getList: 'COUPON_GET_LIST',
    }),
    getRowIcon(row) {
      if (row.newCsort === '') {
        return 'circle-close';
      }
      if (row.csort === row.newCsort) {
        return 'circle-check';
      }
      return row.submitting ? 'loading' : '';
    },
    fetch() {
      this.getList({ category: this.category });
    },
    toggle() {},
  },
};
</script>

<style lang="scss" scoped>
@import '../../styles/views/coupon/index.scss';
</style>
