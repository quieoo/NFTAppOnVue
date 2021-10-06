<template>
  <div class="dashboard-editor-container">
    <el-row>
      <Warning />

      <el-col :span="24">
        <el-form-item style="margin-bottom: 40px;" prop="title">
          <MDinput>
            Query a Token
          </MDinput>
        </el-form-item>

        <div class="postInfo-container">
          <el-row>
            <el-col :span="8">
              <el-form-item style="margin-bottom: 40px;" label-width="70px" label="TokenID:">
                <el-input v-model="postForm.content_short" :rows="1" type="textarea" class="article-textarea" autosize placeholder="Please enter the tokenID" />
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

    <!--       <el-form-item prop="image_uri" style="margin-bottom: 30px;">
               <Upload v-model="postForm.image_uri" />
             </el-form-item>

     -->
    <el-row>
      <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
        Query
      </el-button>
    </el-row>
    <br>

    <p><b>result:</b></p>
    <el-table :data="tableData" style="width: 100%;margin-top:30px;" border>
      <el-table-column
        prop="owner"
        label="Owner"
      />
      <!--         <el-table-column
                   prop="cid"
                   label="CID"
                 />
                 <el-table-column label="DATA"><img :src="emptyGif" class="emptyGif" width="200px" height="200px">
                   </el-table-column>
       -->

    </el-table>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'DashboardEditor',

  data() {
    return {
      emptyGif: 'https://wpimg.wallstcn.com/0e03b7da-db9e-4819-ba10-9016ddfdaed3'
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ])
  }
}
</script>

