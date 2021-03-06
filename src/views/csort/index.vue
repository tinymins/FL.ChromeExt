<template>
  <div class="main">
    <div class="query">
      <el-input
        class="textarea"
        type="textarea"
        :autosize="{ minRows: 5, maxRows: 20 }"
        placeholder="请输入商品ID列表 每行一个"
        v-model="iidsText"
      ></el-input>
      <el-input
        class="textarea"
        type="textarea"
        :autosize="{ minRows: 5, maxRows: 20 }"
        placeholder="超级排序列表 与左侧按行对应 连续相同用空格隔开 如 “100 3” 表示连续三个 100"
        v-model="csortText"
      ></el-input>
    </div>
    <div class="query">
      <el-alert
        v-show="iids.length !== newCsorts.length"
        class="query-mismatch-alert"
        :title="`注意：商品列表数量(${iids.length})与超级排序数量(${newCsorts.length})不匹配！`"
        type="warning"
        show-icon
        :closable="false"
      ></el-alert>
    </div>
    <div class="query">
      <el-button type="primary" class="query-btn" @click="startQuery(false)">增量查询商品列表</el-button>
      <el-button type="primary" class="query-btn" @click="startQuery(true)">重新查询商品列表</el-button>
    </div>
    <div class="list">
      <el-table :data="goodsDraft" class="list-table">
        <el-table-column label="图片" width="80">
          <div slot-scope="scope" :style="{ width: `40px`, height: '40px', 'text-align': 'center' }">
            <img :src="scope.row.image" :style="{ height: '40px', 'max-width': '40px' }">
          </div>
        </el-table-column>
        <el-table-column prop="iid" label="商品ID" width="180">
        </el-table-column>
        <el-table-column label="商品名称">
          <template slot-scope="scope">
            <a :href="scope.row.url" style="color: #2ab3de;" target="__blank">{{ scope.row.title }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="券后价" width="80">
        </el-table-column>
        <el-table-column prop="soldOut" label="售罄" width="80">
        </el-table-column>
        <el-table-column prop="csort" label="当前超级排序" width="80">
        </el-table-column>
        <el-table-column prop="newCsort" label="目标超级排序" width="80">
        </el-table-column>
        <el-table-column label="操作" width="110">
          <template slot-scope="scope">
            <el-button
              :type="scope.row.submitType"
              :icon="getRowIcon(scope.row)"
              :disabled="scope.row.newCsort === undefined"
              @click="submit([scope.row])"
            >{{ scope.row.csort === scope.row.newCsort ? '完成' : '确认' }}</el-button>
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
        @click="submitAll"
      >{{ allSuccess ? '全部完成' : '全部确认' }}</el-button>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import { Input, Button, Table, TableColumn, Alert } from 'element-ui';
import * as storage from '@/utils/storage';
import { CSORT } from '@/store/types';

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
      iidsText: storage.getLocal('csort:iidsText') || '',
      csortText: storage.getLocal('csort:csortText') || '',
    };
  },
  computed: {
    ...mapState('csort', ['goods', 'submitting']),
    iids() {
      return this.iidsText.split('\n').filter(c => c.replace(/\s+/u).length !== 0);
    },
    newCsorts() {
      const sorts = this.csortText.split('\n').filter(c => c.replace(/\s+/u).length !== 0);
      const realSorts = [];
      const re = /(\d+)\s+(\d+)/u;
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
    goodsDraft() {
      return this.goods.map((p, i) => {
        const item = Object.assign({}, p, {
          newCsort: this.newCsorts[i] || '',
        });
        if (item.newCsort === '') {
          item.submitType = 'danger';
        } else if (item.csort === item.newCsort) {
          item.submitType = 'success';
        } else {
          item.submitType = 'primary';
        }
        return item;
      });
    },
    allSuccess() {
      return this.goodsDraft.length !== 0 && this.goodsDraft.filter(c => c.csort !== c.newCsort).length === 0;
    },
    hasSubmitting() {
      return this.goodsDraft.length !== 0 && this.goodsDraft.filter(c => !c.submitting).length === 0;
    },
    hasSubmitable() {
      return this.goodsDraft.filter(c => c.newCsort !== '').length === 0;
    },
  },
  watch: {
    iidsText(iidsText) {
      storage.setLocal('csort:iidsText', iidsText);
    },
    csortText(csortText) {
      storage.setLocal('csort:csortText', csortText);
    },
  },
  methods: {
    ...mapActions('csort', {
      csortQuery: CSORT.QUERY,
      submitSort: CSORT.SUBMIT,
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
    startQuery(reload) {
      this.csortQuery({
        reload,
        iids: this.iids,
      });
    },
    submit(drafts) {
      this.submitSort(drafts.filter(p => p.newCsort !== '' && p.csort !== p.newCsort));
    },
    submitAll() {
      this.submit(this.goodsDraft);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~styles/views/csort/index';
</style>
