<template>
  <div class="createPost-main-container">
    <br>
    <h1>欢迎观看FI-NFT项目演示 V0.0.1</h1>
    <br>

    <el-divider />
    <br>
    <font size="4">接下来我们将展示建立在Hyperledger Fabric 与IPFS之上的简单NFT拍卖市场示例</font>
    <br>
    <br>
    <br>
    <br>

    <!--    <img src="https://asset.businesslawyers.jp/articles/9d3eaa98d1f5c7bbb3d135b65d2fc43da9baf724.jpg" width="640" height="260">

    <br>
    <img src="https://hx24.huoxing24.com/image/crawler/2021/03/03/1614775891386426.jpg" width="640" height="260">
    <br>

    <div class="demo-image__lazy">

      <el-image v-for="url in urls" :key="url" :src="url" lazy />

    </div>
    -->
    <div class="block">
      <el-carousel interval="4000" type="card" height="500px">
        <el-carousel-item v-for="item in imagebox" :key="item.id">
          <img :src="item.idView" class="image">
        </el-carousel-item>
      </el-carousel>
    </div>

  </div>

</template>

<script>

import Tinymce from '@/components/Tinymce'
import MDinput from '@/components/MDinput'
import Upload from '@/components/Upload/SingleImage3'
import Sticky from '@/components/Sticky'
import Warning from '@/views/example/components/Warning'
import { CommentDropdown, PlatformDropdown, SourceUrlDropdown } from '@/views/example/components/Dropdown'
import { validURL } from '@/utils/validate'
import { fetchArticle } from '@/api/article'
import { searchUser } from '@/api/remote-search'

const defaultForm = {
  status: 'draft',
  title: '', // 文章题目
  content: '', // 文章内容
  content_short: '', // 文章摘要
  source_uri: '', // 文章外链
  image_uri: '', // 文章图片
  display_time: undefined, // 前台展示时间
  id: undefined,
  platforms: ['a-platform'],
  comment_disabled: false,
  importance: 0
}

export default {
  name: 'ArticleDetail',
  // eslint-disable-next-line vue/no-unused-components
  components: { Tinymce, MDinput, Upload, Sticky, Warning, CommentDropdown, PlatformDropdown, SourceUrlDropdown },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    const validateSourceUri = (rule, value, callback) => {
      if (value) {
        if (validURL(value)) {
          callback()
        } else {
          this.$message({
            message: '外链url填写不正确',
            type: 'error'
          })
          callback(new Error('外链url填写不正确'))
        }
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      rules: {
        image_uri: [{ validator: validateRequire }],
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }],
        source_uri: [{ validator: validateSourceUri, trigger: 'blur' }]
      },
      tempRoute: {},
      tableData: [{
        owner: 'x509::CN=recipient,U=client,0=Hyperledger ,ST=North Carolina ,C=Us:CN=ca.org2.example.com,O=org2.example.com,L=Hursley ,ST=Hampshire , C=uK',
        cid: 'QmfCu5g3Zy2893JTHbCthVMej951gEkceXiNjkxdoCs6u3',
        data: 'https://github.com/quieoo/nft_fabric_ipfs/blob/main/architecture/p.png'
      }],
      fits: ['fill'],
      url: '/home/quieoo/desktop/fabric/fabric-samples/web/NFTAppOnVue/src/views/dashboard/admin/1.webp',
      emptyGif: 'https://wpimg.wallstcn.com/0e03b7da-db9e-4819-ba10-9016ddfdaed3',
      urls: [
        'https://hx24.huoxing24.com/image/crawler/2021/03/03/1614775891386426.jpg',
        'https://asset.businesslawyers.jp/articles/9d3eaa98d1f5c7bbb3d135b65d2fc43da9baf724.jpg'
      ],
      imagebox: [{ id: 0, idView: require('@/assets/fabric.png') },
        { id: 1, idView: require('@/assets/ipfs.jpeg') },
        { id: 2, idView: require('@/assets/nft.jpg') },
        { id: 3, idView: require('@/assets/auction.jpg') }
        // imagebox是assets下一个放图片的文件夹
      ],
      screenWidth: 1000
    }
  },

  computed: {
    contentShortLength() {
      return this.postForm.content_short.length
    },
    displayTime: {
      // set and get is useful when the data
      // returned by the back end api is different from the front end
      // back end return => "2013-06-25 06:59:25"
      // front end need timestamp => 1372114765000
      get() {
        return (+new Date(this.postForm.display_time))
      },
      set(val) {
        this.postForm.display_time = new Date(val)
      }
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {

    fetchData(id) {
      fetchArticle(id).then(response => {
        this.postForm = response.data

        // just for test
        this.postForm.title += `   Article Id:${this.postForm.id}`
        this.postForm.content_short += `   Article Id:${this.postForm.id}`

        // set tagsview title
        this.setTagsViewTitle()

        // set page title
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = 'Edit Article'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.id}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = 'Edit Article'
      document.title = `${title} - ${this.postForm.id}`
    },
    submitForm() {
      console.log(this.postForm)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$notify({
            title: '成功',
            message: '发布文章成功',
            type: 'success',
            duration: 2000
          })
          this.postForm.status = 'published'
          this.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    draftForm() {
      if (this.postForm.content.length === 0 || this.postForm.title.length === 0) {
        this.$message({
          message: '请填写必要的标题和内容',
          type: 'warning'
        })
        return
      }
      this.$message({
        message: '保存成功',
        type: 'success',
        showClose: true,
        duration: 1000
      })
      this.postForm.status = 'draft'
    },
    getRemoteUserList(query) {
      searchUser(query).then(response => {
        if (!response.data.items) return
        this.userListOptions = response.data.items.map(v => v.name)
      })
    }
  }
}

</script>
<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;}

.github-corner {
  position: absolute;
  top: 0px;
  border: 0;
  right: 0;
}

.chart-wrapper {
  background: #fff;
  padding: 16px 16px 0;
  margin-bottom: 32px;
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
img{
  /*设置图片宽度和浏览器宽度一致*/
  width:100%;
  height:inherit;
}
@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
