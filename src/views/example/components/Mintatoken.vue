<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">

      <sticky :z-index="10" :class-name="'sub-navbar '+postForm.status">
        <el-button v-loading="loading" type="info" @click="showClient">@{{ clientID }}</el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <Warning />

          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput>
                使用唯一的tokenID与上传的数字资产铸造属于你的NFT
              </MDinput>
            </el-form-item>
            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-form-item style="margin-bottom: 40px;" label-width="70px" label="TokenID:">
                    <el-input v-model="postForm.tokenID" :rows="1" type="textarea" class="article-textarea" autosize placeholder="Please enter the tokenID" />
                  </el-form-item>

                </el-col>

              </el-row>
              <!--
              <el-row>
                <el-col :span="8">
                  <el-form-item style="margin-bottom: 40px;" label-width="70px" label="AccountID:">
                    <el-input v-model="postForm.title" :rows="1" type="textarea" class="article-textarea" autosize placeholder="Please enter the base64-encoded target accountID" />
                  </el-form-item>

                </el-col>

              </el-row>
-->

            </div>
          </el-col>
        </el-row>
        <input type="file" class="preFile" name="staffFile" multiple="multiple" @change="changeFn($event)">
        <!--
        <el-form-item prop="image_uri" style="margin-bottom: 30px;">
          <Upload v-model="postForm.image_uri" />
        </el-form-item>

        <el-row>
          <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
            Publish
          </el-button>
        </el-row>-->
        <p>
          {{ postForm.debuginfo }}
        </p>
        <br>
        <!-- 根据image_uri输出图片
        <el-popover placement="right" trigger="hover">
          <img :src="postForm.image_uri" style="width: 500px;height: 400px">
          <img slot="reference" :src="postForm.image_uri" style="width: 300px;height: 200px">
        </el-popover>
-->
        <!--        <p><b>result:</b></p>
        <el-table :data="tableData" style="width: 100%;margin-top:30px;" border>
          <el-table-column
            prop="owner"
            label="Owner"
          />
          <el-table-column
            prop="cid"
            label="CID"
          />
          <el-table-column label="DATA"><img :src="emptyGif" class="emptyGif" width="200px" height="200px">
            </el-table-column>

        </el-table>
-->
      </div></el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/SingleImage3'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import { validURL } from '@/utils/validate'
import { fetchArticle, getOrg } from '@/api/article'
import { searchUser } from '@/api/remote-search'
import Warning from './Warning'
import { CommentDropdown, PlatformDropdown, SourceUrlDropdown } from './Dropdown'
import { getClientID } from '@/api/article'
import { exec } from 'child_process'

const defaultForm = {
  tokenID: '',
  image_uri: '', // 文章图片
  debuginfo: '',
  status: 'draft',
  title: '', // 文章题目
  content: '', // 文章内容
  content_short: '', // 文章摘要
  source_uri: '', // 文章外链
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
      shell_command: '',
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
      url: 'C:\\Users\\81433\\Desktop\\PICTURE\\p.webp',
      emptyGif: 'https://wpimg.wallstcn.com/0e03b7da-db9e-4819-ba10-9016ddfdaed3',
      clientID: getClientID(),
      org: getOrg()
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
    this.clientID = getClientID()
    this.org = getOrg()
    /*
    var params = new URLSearchParams()
    params.append('u', 'li')
    params.append('p', '123')
    // 通过URLSearchParams()改变上传的参数格式为u=%E8%BF%AA%E8%BF%A6&p=123456
    this.$axios({
      method: 'post',
      url: '/api/user',
      params
    }).then((res) => {
      alert(res.data)
    }).catch(err => {
      alert(err)
    })*/
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
    changeFn(e) {
      // 新建 formData 对象
      const formData = new FormData()
      // 添加文件信息
      formData.append('file', e.target.files[0])
      formData.append('clientID', this.clientID)
      formData.append('org', getOrg())
      formData.append('tokenID', this.postForm.tokenID)
      const config = {
        // 必须
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      this.$axios.post('api/mint', formData, config).then(result => {
        alert(result.data)
      })
    },
    async shell() {
      return new Promise((resolve, reject) => {
        alert('before exec')
        exec(this.shell_command, (err, stdout, stderr) => {
          alert('after exec')
          if (err) {
            reject(err)
          } else {
            resolve({ stdout, stderr })
          }
        })
      })
    },

    async shellExec() {
      const { stdout } = await this.shell()
      alert(this.shell_command)
      alert(stdout)
      for (const line of stdout.split('\n')) {
        console.log(`ls: ${line}`)
      }
    },
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
      var params = new URLSearchParams()
      params.append('clientID', this.clientID)
      params.append('org', getOrg())
      params.append('tokenID', this.postForm.tokenID)
      params.append('fileURI', this.postForm.image_uri)
      alert(params.toString())
      // 通过URLSearchParams()改变上传的参数格式为u=%E8%BF%AA%E8%BF%A6&p=123456
      this.$axios({
        method: 'post',
        url: '/api/mint',
        params
      }).then((res) => {
        alert(res.data)
      }).catch(err => {
        alert(err)
      })
      // alert('tokenid size: ' + this.postForm.tokenID.length + ' image size: ' + this.postForm.image_uri.length / 1024)
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
  @import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea ::v-deep {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>
