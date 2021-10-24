<template>
  <div class="auction-container">
    <h1>拍卖市场</h1>
    <h3>NFT商品总数：{{ totalBids }}</h3>
    <el-divider />

    <div class="goods-container">
      <el-row gutter="15" align="middle">
        <el-col :span="10" :offset="7">
          <div class="grid-content bg-purple">
            <el-image
              style="width: 700px; height: 500px"
              :src="image_url"
              :fit="fits"
            />
          </div>
        </el-col>
      </el-row>

    </div>
    <div class="now-price-container">
      <el-row gutter="15">
        <el-col :span="10" :offset="9">
          <div class="grid-content bg-purple">
            <el-table :data="tableData" style="width: 70%;margin-top:15px;">
              <el-table-column
                prop="tokenID"
                label="商品号"
              />
              <el-table-column
                prop="cp"
                label="当前价格"
              />
              <el-table-column
                prop="kp"
                label="秒杀价格"
              />
              <el-table-column
                prop="co"
                label="出价者"
              />
              <el-table-column
                prop="lt"
                label="剩余时间(分钟)"
              />
            </el-table>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="bid-container">
      <el-row gutter="15">
        <el-col :span="5" :offset="10">
          <div class="grid-content bg-purple">
            <el-form>
              <el-form-item>
                <el-input
                  v-model="form.input"
                  style="width:200px;height:50px"
                  placeholder="请输入竞拍价格"
                  clearable
                />
                <el-button type="primary" size="medium" @click="Submit">提交出价</el-button>
              </el-form-item>
            </el-form>

          </div>
        </el-col>
      </el-row>
    </div>
    <el-divider />
    <div class="page-change-container">
      <el-row gutter="15">
        <el-col :span="5" :offset="1">
          <el-button @click="lastPage">上一页</el-button>
        </el-col>
        <el-col :span="2" :offset="16">
          <el-button @click="nextPage">下一页</el-button>
        </el-col>

      </el-row>

    </div>

  </div>

</template>
<script>
import { getBidIndex, getClientID, getOrg, updataBidIndex } from '@/api/article'
import Vue from 'vue'
let tid
export default {
  data() {
    return {
      doUpload: 'C:\\Users\\81433\\Desktop\\PICTURE',
      // 接受输入的竞价信息（四个从左到右）
      form: {
        input: ''
      },
      // 图片展示格式与数据源
      fits: ['contain'],
      image_url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      // 当前竞价与秒杀价表格数据源
      tableData: [
        { tokenID: '', cp: '', co: '', kp: '', lt: '' }
      ],
      CurrentPrice: ['11', '22', '33', '44'],
      currentIndex: 0,
      totalBids: 0,
      clientID: getClientID(),
      org: getOrg(),
      bidIndex: getBidIndex(),
      timestamp: ''
    }
  },
  created() {
  },
  methods: {
    showBids(index) {
      if (index === -1) {
        alert('无在拍NFT')
        this.image_url = 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
        Vue.set(this.tableData, 0, { tokenID: '', cp: '', co: '', kp: '', lt: '' })
      } else {
        const params = new URLSearchParams()
        params.append('clientID', this.clientID)
        params.append('org', this.org)
        params.append('index', index.toString())
        this.$axios({
          method: 'post',
          url: '/api/getBidsByIndex',
          params
        }).then((result) => {
          const _tokenID = result.data.TokenID
          tid = _tokenID
          this.image_url = '/api/uploads/' + _tokenID + '.png'
          const _cp = result.data.CurrentPrice
          const _kp = result.data.KillPrice
          const _co = result.data.CurrentOwner
          const ct = new Date().getTime()
          const _lt = ((result.data.LifeTime) - (ct - result.data.CreateTime)) / (1000 * 60)
          Vue.set(this.tableData, 0, { tokenID: _tokenID, cp: _cp, co: _co, kp: _kp, lt: _lt })
        }).catch((err) => {
          alert(err)
        })
      }
    },
    getTotalBids(callback) {
      const params = new URLSearchParams()
      params.append('clientID', this.clientID)
      params.append('org', this.org)
      this.$axios({
        method: 'post',
        url: '/api/totalbids',
        params
      }).then((result) => {
        this.totalBids = result.data
        callback(result.data)
      }).catch((err) => {
        alert(err)
      })
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    // 四个竞价按钮事件（四个从左到右）
    Submit() {
      const params = new URLSearchParams()
      params.append('clientID', this.clientID)
      params.append('org', this.org)
      params.append('price', this.form.input)
      params.append('tokenID', tid)
      this.$axios({
        method: 'post',
        url: '/api/offer',
        params
      }).then((result) => {
        alert(result.data)
      }).catch((err) => {
        alert(err)
      })
    },
    // 上一页下一页按钮事件
    lastPage() {
      this.getTotalBids((totalBids) => {
        updataBidIndex(-1, totalBids, newBidIndex => {
          this.showBids(newBidIndex)
        })
      })
    },
    nextPage() {
      this.getTotalBids((totalBids) => {
        updataBidIndex(1, totalBids, newBidIndex => {
          this.showBids(newBidIndex)
        })
      })
    }

  }

}
</script>
