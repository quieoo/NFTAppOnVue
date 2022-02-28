<template>
  <div class="auction-container">
    <el-row>
      <el-col :span="1" :offset="23">
        <el-button v-loading="loading" type="info" @click="showClient">@{{ clientID }}</el-button>
      </el-col>
    </el-row>

    <h1>我的资产</h1>
    <h3>我的NFT总数：{{ totalNFTs }}</h3>
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

    <div class="status-container">
      <el-row gutter="15">
        <el-col :span="10" :offset="9">
          <div class="grid-content bg-purple">
            <el-table :data="tableData" style="width: 70%;margin-top:15px;">
              <el-table-column
                prop="tokenID"
                label="tokenID"
              />
              <el-table-column
                prop="cid"
                label="资产标识"
              />
              <el-table-column
                prop="status"
                label="在拍"
              />
              <el-table-column
                prop="filetype"
                label="文件类型"
              />
            </el-table>
          </div>
        </el-col>
      </el-row>
    </div>
    <br>
    <div align="center">
      <el-button type="primary" size="medium" @click="puton">上架资产到市场</el-button>
    </div>

    <el-divider />
    <div class="page-change-container">
      <el-row gutter="15">
        <el-col :span="5" :offset="1">
          <el-button @click="page1">上一页</el-button>
        </el-col>
        <el-col :span="2" :offset="16">
          <el-button @click="page2">下一页</el-button>
        </el-col>
      </el-row>
    </div>
  </div>

</template>
<script>
import { getClientID, getOrg, updataNFTIndex } from '@/api/article'
import Vue from 'vue'

const defaultForm = {
  status: 'draft'
}

let lowerPrice
let higherPrice
let lifeMinute
let tokenID
export default {
  data() {
    return {
      postForm: Object.assign({}, defaultForm),
      // 图片展示格式及图片源
      fits: ['contain'],
      image_url: require('@/assets/loading.jpg'),
      // 上架状态及价格信息表
      tableData: [{
        tokenID: '',
        cid: '',
        status: '',
        filetype: ''
      }],
      totalNFTs: 0,
      clientID: getClientID(),
      org: getOrg()
    }
  },
  created() {
    this.getTotalNFTs()
  },
  methods: {
    // 上架操作（四个从左到右
    puton() {
      this.$prompt('请输入拍卖底价', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(({ value }) => {
          // 在这写上架操作，value是作者设定的最高价
          lowerPrice = value
          this.$prompt('请输入秒杀价格', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(({ value }) => {
            higherPrice = value
            this.$prompt('请输入拍卖时长（分钟数，不超过3天）', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消'
            }).then(({ value }) => {
              lifeMinute = value
              this.addBid(lowerPrice, higherPrice, lifeMinute)
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '取消输入'
              })
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消输入'
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          })
        })
    },
    // 上一页下一页
    page1() {
      this.getTotalNFTs((totalnfts) => {
        updataNFTIndex(-1, totalnfts, nftIndex => {
          this.showNFT(nftIndex)
        })
      })
    },
    page2() {
      this.getTotalNFTs((totalnfts) => {
        updataNFTIndex(1, totalnfts, nftIndex => {
          this.showNFT(nftIndex)
        })
      })
    },
    getTotalNFTs(callback) {
      const params = new URLSearchParams()
      params.append('clientID', this.clientID)
      params.append('org', this.org)
      this.$axios({
        method: 'post',
        url: '/api/totalnfts',
        params
      }).then((result) => {
        this.totalNFTs = result.data
        if (typeof callback === 'function') {
          callback(result.data)
        }
      }).catch((err) => {
        alert(err)
      })
    },
    showClient() {
      const params = new URLSearchParams()
      params.append('clientID', this.clientID)
      params.append('org', getOrg())
      this.$axios({
        method: 'post',
        url: '/api/account',
        params
      }).then((result) => {
        alert(result.data)
      }).catch((err) => {
        alert(err)
      })
    },
    showNFT(index) {
      if (index === -1) {
        alert('无NFT')
        this.image_url = require('@/assets/loading.jpg')
        Vue.set(this.tableData, 0, { tokenID: '', cid: '', status: '' })
      } else {
        const params = new URLSearchParams()
        params.append('clientID', this.clientID)
        params.append('org', this.org)
        params.append('index', index.toString())
        this.$axios({
          method: 'post',
          url: 'api/getNFTByIndex',
          params
        }).then((result) => {
          const _tokenID = result.data.tokenID
          const _type = result.data.FileType
          tokenID = _tokenID
          this.image_url = '/api/uploads/' + _tokenID + '.' + _type
          const _cid = result.data.CID
          Vue.set(this.tableData, 0, { cid: _cid, tokenID: _tokenID, status: result.data.Status, filetype: result.data.FileType })
        }).catch((err) => {
          alert(err)
        })
      }
    },
    addBid(lp, hp, lt) {
      const params = new URLSearchParams()
      params.append('clientID', this.clientID)
      params.append('org', this.org)
      params.append('lowerPrice', lp)
      params.append('higherPrice', hp)
      params.append('lifeTime', lt)
      params.append('tokenID', tokenID)
      this.$axios({
        method: 'post',
        url: 'api/addbid',
        params
      }).then((result) => {
        alert('上架成功\n')
      }).catch((err) => {
        alert(err)
      })
    }
  }

}
</script>

<style lang="scss">
@import "~@/styles/mixin.scss";

</style>
