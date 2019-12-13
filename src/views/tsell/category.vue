<template>
  <div class="main">
    <div class="query">
      <el-button type="primary" class="query-btn" @click="startQuery({ reload: true })">刷新列表</el-button>
      <el-button type="primary" class="query-btn" @click="startQuery({ reload: false })">增量获取列表</el-button>
      <el-button type="primary" class="query-btn" @click="toggleQueryTimer" :disabled="!user">定点更新 {{ dispTimer }}</el-button>
    </div>
    <div class="list">
      <div v-for="(category, i) in categoryList" :key="i" class="list-item">
        <div class="list-item__label">
          <a
            :href="`http://trace.51fanli.com/index.php/Tuan/TuanNewzcFloor/edit/id/${category.id}`"
            target="_blank"
          >{{ category.dst }}</a>
          <i v-if="category.done" class="list-item__status success el-icon-success"></i>
          <i v-else class="list-item__status question el-icon-question"></i>
        </div>
        <el-input
          class="list-item__uids"
          type="textarea"
          :autosize="{ maxRows: 4 }"
          v-model="categoryList[i].uids"
        ></el-input>
      </div>
    </div>
    <div class="query">
      <el-button type="primary" class="query-btn" @click="commit">提交</el-button>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import { Input, Button, Table, TableColumn, Alert } from 'element-ui';
import { USER, TSELL } from '@/store/types';

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
      dsList: [
        { url: 'https://www.dataoke.com/top_sell?type=1', name: '全部', list: [] },
        { url: 'https://www.dataoke.com/top_sell?cid=4&type=1', name: '居家日用', list: [] },
        { url: 'https://www.dataoke.com/top_sell?cid=6&type=1', name: '美食', list: [] },
        { url: 'https://www.dataoke.com/top_sell?cid=2&type=1', name: '母婴', list: [] },
        { url: 'https://www.dataoke.com/top_sell?cid=3&type=1', name: '美妆', list: [] },
        { url: 'https://www.dataoke.com/top_sell?cid=1&type=1', name: '女装', list: [] },
        { url: 'https://www.dataoke.com/top_sell?cid=8&type=1', name: '数码家电', list: [] },
        { url: 'https://www.dataoke.com/top_sell?cid=7&type=1', name: '文娱车品', list: [] },
        { url: 'https://www.dataoke.com/top_sell?cid=10&type=1', name: '内衣', list: [] },
        { url: 'https://www.dataoke.com/top_sell?cid=14&type=1', name: '家装家纺', list: [] },
        { url: 'https://www.dataoke.com/top_sell?cid=5&type=1', name: '鞋品', list: [] },
        { url: 'https://www.dataoke.com/top_sell?cid=9&type=1', name: '男装', list: [] },
        { url: 'https://www.dataoke.com/top_sell?cid=12&type=1', name: '配饰', list: [] },
        { url: 'https://www.dataoke.com/top_sell?cid=13&type=1', name: '户外运动', list: [] },
        { url: 'https://www.dataoke.com/top_sell?cid=11&type=1', name: '箱包', list: [] },
      ],
      categoryList: [
        { id: 3731, dst: '总榜', src: [{ name: '全部', count: 100 }], list: [], uids: '', done: false },
        { id: 3733, dst: '居家', src: [{ name: '居家日用', count: 40 }], list: [], uids: '', done: false },
        { id: 3735, dst: '美食', src: [{ name: '美食', count: 35 }], list: [], uids: '', done: false },
        { id: 3737, dst: '美妆', src: [{ name: '美妆', count: 35 }], list: [], uids: '', done: false },
        { id: 3739, dst: '女装', src: [{ name: '女装', count: 30 }], list: [], uids: '', done: false },
        { id: 3741, dst: '数码家电', src: [{ name: '数码家电', count: 30 }], list: [], uids: '', done: false },
        { id: 3743, dst: '内衣', src: [{ name: '内衣', count: 20 }], list: [], uids: '', done: false },
        { id: 3745, dst: '男装', src: [{ name: '男装', count: 30 }], list: [], uids: '', done: false },
        { id: 3747, dst: '母婴', src: [{ name: '母婴', count: 30 }], list: [], uids: '', done: false },
        { id: 3749, dst: '鞋包', src: [{ name: '鞋品', count: 20 }, { name: '箱包', count: 10 }], list: [], uids: '', done: false },
        { id: 3751, dst: '配饰', src: [{ name: '配饰', count: 20 }], list: [], uids: '', done: false },
        { id: 3753, dst: '运动户外', src: [{ name: '户外运动', count: 20 }], list: [], uids: '', done: false },
      ],
      timer: 0,
      time: 0,
      nextTime: 0,
    };
  },
  computed: {
    ...mapGetters('user', ['user']),
    dispTimer() {
      if (!this.user) {
        return '请先登录';
      }
      return this.timer ? this.nextTime - this.time : '';
    },
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  methods: {
    ...mapActions('user', {
      apiGetUser: USER.GET,
    }),
    ...mapActions('tsell', {
      apiQueryList: TSELL.QUERY_LIST,
      apiGetZcfloor: TSELL.GET_ZCFLOOR,
      apiSetZcfloor: TSELL.SET_ZCFLOOR,
    }),
    async startQuery({ reload = false }) {
      if (reload) {
        this.dsList = this.dsList.map(ds => Object.assign({}, ds, { list: [] }));
      }
      let i = 0;
      const next = () => new Promise((resolve, reject) => {
        const ds = this.dsList[i];
        if (i < this.dsList.length) {
          if (ds && ds.list.length === 0) {
            this.apiQueryList({ url: ds.url }).then((res) => {
              this.dsList[i].list = res.data;
              this.dsList[i].name = res.extra.category;
              i += 1;
              next().then(resolve).catch(reject);
            });
          } else {
            i += 1;
            next().then(resolve).catch(reject);
          }
        } else {
          resolve();
        }
      });
      await next();
      this.refreshCategoryList();
    },
    refreshCategoryList() {
      for (let i = 0; i < this.categoryList.length; i += 1) {
        const category = this.categoryList[i];
        const list = [];
        category.src.forEach((item) => {
          const ds = this.dsList.find(p => p.name === item.name);
          if (ds) {
            for (let j = 0; j < item.count; j += 1) {
              list.push(ds.list[j]);
            }
          }
        });
        category.done = false;
        category.list = list.filter(_ => _);
        category.uids = category.list.map(item => item.uid).join(',');
      }
    },
    commit() {
      return Promise.all(this.categoryList.map(category => new Promise((resolve, reject) => {
        this.apiGetZcfloor({ id: category.id }).then((res) => {
          const ctg = category;
          const form = res.data.form;
          const json = res.data.json;
          ctg.done = true;
          form['1_h5_num_ids'.toString()] = ctg.uids;
          json['floor_id'.toString()] = form.id;
          json['h5_num_ids'.toString()] = ctg.uids;
          this.apiSetZcfloor({ form, json });
          resolve();
        }).catch(reject);
      })));
    },
    toggleQueryTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = 0;
      } else {
        this.timer = setInterval(() => {
          const time = new Date();
          this.time = Math.floor(time.valueOf() / 1000);
          if (this.time > this.nextTime) {
            if (this.nextTime) {
              this.startQuery({ reload: true }).then(() => {
                this.commit();
              });
            }
            this.nextTime = this.time
              + ((Math.ceil((time.getHours() + 1) / 2) * 2 - time.getHours()) * 3600)
              - (time.getMinutes() * 60)
              - time.getSeconds();
          }
          if (this.time % 20 === 0) {
            this.apiGetUser({ reload: true, silent: true });
          }
        }, 1000);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~styles/views/tsell/category';
</style>
