<template>
  <div class="main">
    <div class="query">
      <el-input v-model="url" type="text" placeholder="请输入页面地址或页面源码"></el-input>
      <el-button type="primary" class="query-btn" @click="queryList({ url, reload: true })">刷新列表</el-button>
      <el-button type="primary" class="query-btn" @click="queryItems({ reload: false })">增量获取详细数据</el-button>
      <el-button type="primary" class="query-btn" @click="queryItems({ reload: true })">刷新全部详细数据</el-button>
    </div>
    <div class="list">
      <el-table class="list-table" :data="goods">
        <el-table-column label="商品名称" prop="name" sortable></el-table-column>
        <el-table-column label="券后价" prop="finalPrice" width="80" sortable></el-table-column>
        <el-table-column label="优惠券" prop="discount" width="80" sortable></el-table-column>
        <el-table-column label="计划类型" prop="planType" width="100" sortable></el-table-column>
        <el-table-column label="百分比" prop="planNum" width="80" sortable></el-table-column>
        <el-table-column label="UID" prop="uid" width="100" sortable></el-table-column>
        <el-table-column label="商品地址" prop="url" sortable></el-table-column>
        <el-table-column label="优惠券地址" prop="discountUrl" sortable></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState, mapMutations } from 'vuex';
import { Input, Button, Table, TableColumn, Alert } from 'element-ui';
import { TSELL } from '@/store/types';

export default {
  components: {
    [Input.name]: Input,
    [Button.name]: Button,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Alert.name]: Alert,
  },
  data() {
    return {
      url: 'https://www.dataoke.com/top_sell',
    };
  },
  computed: {
    ...mapState('tsell', ['goods']),
  },
  methods: {
    ...mapActions('tsell', {
      apiQueryList: TSELL.QUERY_LIST,
      apiQueryItems: TSELL.QUERY_ITEMS,
    }),
    ...mapMutations('tsell', {
      apiClearList: TSELL.QUERY_LIST,
      apiDecodeList: TSELL.QUERY_LIST_SUCCESS,
    }),
    queryList(...args) {
      if (this.url.match(/^https?:\/\//u)) {
        this.apiQueryList(...args);
      } else {
        this.apiClearList();
        this.apiDecodeList({
          url: '',
          html: this.url,
        });
      }
    },
    queryItems(...args) {
      return this.apiQueryItems(...args);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~styles/views/tsell/realtime';
</style>
