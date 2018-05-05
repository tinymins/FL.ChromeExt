<template>
  <div>
    <div class="query">
      <el-input
        class="textarea"
        type="textarea"
        :autosize="{ minRows: 5, maxRows: 20}"
        placeholder="请输入商品ID列表 每行一个"
        v-model="goodsIdsS">
      </el-input>
      <el-input
        class="textarea"
        type="textarea"
        :autosize="{ minRows: 5, maxRows: 20}"
        placeholder="超级排序列表 与左侧按行对应 连续相同用空格隔开 如 “100 3” 表示连续三个 100"
        v-model="sortValsS">
      </el-input>
    </div>
    <div class="query">
      <el-alert
        v-show="goodsIds.length !== sortVals.length"
        class="query-mismatch-alert"
        :title="`注意：商品列表数量(${goodsIds.length})与超级排序数量(${sortVals.length})不匹配！`"
        type="warning"
        show-icon
        :closable="false"
      ></el-alert>
    </div>
    <div class="query">
      <el-button type="primary" class="query-btn" @click="startQuery(false)">查询商品列表</el-button>
      <el-button type="primary" class="query-btn" @click="startQuery(true)">重新解析超级排序</el-button>
    </div>
    <div class="list">
      <el-table :data="goods" class="list-table">
        <el-table-column label="图片" width="80">
          <template slot-scope="scope">
            <img :src="scope.row.image" style="max-width: 50px; max-height: 50px;">
          </template>
        </el-table-column>
        <el-table-column prop="uid" label="ID" width="100">
        </el-table-column>
        <el-table-column prop="id" label="商品ID" width="180">
        </el-table-column>
        <el-table-column label="商品名称">
          <template slot-scope="scope">
            <a :href="scope.row.url" style="color: #2AB3DE;" target="__blank">{{ scope.row.name }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="当前超级排序" width="80">
        </el-table-column>
        <el-table-column prop="newSort" label="目标超级排序" width="80">
        </el-table-column>
        <el-table-column label="操作" width="110">
          <template slot-scope="scope">
            <el-button
              :type="scope.row.newSort === undefined ? 'danger' : (scope.row.sort === scope.row.newSort ? 'success' : 'primary')"
              :icon="getRowIcon(scope.row)"
              :disabled="scope.row.newSort === undefined"
              @click="submit([scope.row])"
            >{{ scope.row.sort === scope.row.newSort ? '完成' : '确认' }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="submit">
      <el-button
        class="submit-btn"
        :type="allSuccess ? 'success' : 'primary'"
        :icon="hasSubmitting ? 'loading' : (allSuccess ? 'circle-check' : '')"
        :disabled="hasSubmitable"
        @click="submit()"
      >{{ allSuccess ? '全部完成' : '全部确认' }}</el-button>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import { Input, Button, Table, TableColumn, Alert } from 'element-ui';

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
      goodsIdsS: '',
      sortValsS: '',
    };
  },
  computed: {
    ...mapState('csort', ['goods', 'submitting']),
    allSuccess() {
      return this.goods.length !== 0 && this.goods.filter(c => c.sort !== c.newSort).length === 0;
    },
    hasSubmitting() {
      return this.goods.length !== 0 && this.goods.filter(c => !c.submitting).length === 0;
    },
    hasSubmitable() {
      return this.goods.filter(c => c.newSort !== undefined).length === 0;
    },
    goodsIds() {
      return this.goodsIdsS.split('\n').filter(c => c.replace(/\s+/).length !== 0);
    },
    sortVals() {
      const sorts = this.sortValsS.split('\n').filter(c => c.replace(/\s+/).length !== 0);
      const realSorts = [];
      const re = /(\d+)\s+(\d+)/;
      sorts.forEach((s) => {
        const r = re.exec(s);
        if (r) {
          for (let index = 0; index < r[2]; index += 1) {
            realSorts.push(r[1].toString());
          }
        } else {
          realSorts.push(s);
        }
      });
      return realSorts;
    },
  },
  methods: {
    ...mapActions('csort', {
      csortQuery: 'CSORT_QUERY',
      submitSort: 'CSORT_SUBMIT',
    }),
    getRowIcon(row) {
      if (row.newSort === undefined) {
        return 'circle-close';
      }
      if (row.sort === row.newSort) {
        return 'circle-check';
      }
      return row.submitting ? 'loading' : '';
    },
    startQuery(local) {
      this.csortQuery({
        local,
        ids: this.goodsIds,
        newSorts: this.sortVals,
      });
    },
    submit(values) {
      let list = values;
      if (!list) {
        list = this.goods;
      }
      this.submitSort(list);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../styles/views/csort/index.scss';
</style>
