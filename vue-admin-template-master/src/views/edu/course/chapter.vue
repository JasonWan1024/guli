<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>
    <el-steps
      :active="2"
      process-status="wait"
      align-center
      style="margin- bottom: 40px;"
    >
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="最终发布" />
    </el-steps>

    <ul class="chanpterList">
      <li v-for="chapter in chapterVideoList" :key="chapter.id">
        <p>
          {{ chapter.title }}
          <span class="acts">
            <el-button type="text" @click="openVideo(chapter.id)"
              >添加课时</el-button
            >
            <el-button type="text" @click="openEditChapter(chapter.id)"
              >编辑</el-button
            >
            <el-button type="text" @click="removeChapter(chapter.id)"
              >删除</el-button
            >
          </span>
        </p>
        <!-- 视频 -->
        <ul class="chanpterList videoList">
          <li v-for="video in chapter.children" :key="video.id">
            <p>
              {{ video.title }}
              <span class="acts">
                <el-button type="text" @click="openEditVideo(video.id)"
                  >编辑</el-button
                >
                <el-button type="text" @click="removeVideo(video.id)"
                  >删除</el-button
                ></span
              >
            </p>
          </li>
        </ul>
      </li>
    </ul>

    <el-button @click="openChapterDialog">添加章节</el-button>

    <div>
      <el-button @click="previous">上一步</el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="next"
        >下一步
      </el-button>
    </div>
    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title" />
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number
            v-model="chapter.sort"
            :min="0"
            controls-
            position="right"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加和修改课时表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title" />
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number
            v-model="video.sort"
            :min="0"
            controls-
            position="right"
          />
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.free">
            <el-radio :label="true">免费</el-radio>
            <el-radio :label="false">默认</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传视频">
          <!-- TODO -->
          <el-upload
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-remove="beforeVodRemove"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            :action="BASE_API + '/eduvod/video/uploadVideo'"
            :limit="1"
            class="upload-demo"
          >
            <el-button size="small" type="primary">上传视频</el-button>
            <el-tooltip placement="right-end">
              <div slot="content">
                最大支持1G，<br />
                支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br />
                GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br />
                MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br />
                SWF、TS、VOB、WMV、WEBM 等视频格式上传
              </div>
              <i class="el-icon-question" />
            </el-tooltip>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button
          :disabled="saveVideoBtnDisabled"
          type="primary"
          @click="saveOrUpdateVideo"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import chapter from "@/api/edu/chapter";
import video from "@/api/edu/video";
export default {
  data() {
    return {
      saveBtnDisabled: false,
      saveVideoBtnDisabled: false,
      courseId: "",
      chapterVideoList: [],
      defaultProps: {
        children: "children",
        label: "title",
      },
      dialogChapterFormVisible: false,
      dialogVideoFormVisible: false,
      chapter: {
        title: "",
        sort: 0,
      },
      video: {
        // 课时对象
        title: "",
        sort: 0,
        free: 0,
        videoSourceId: "",
        videoOriginalName: "", //视频名称
      },
      fileList: [], //上传文件列表
      BASE_API: process.env.BASE_API, // 接口API地址
    };
  },
  created() {
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id;
      this.getChapterVideo();
    }
  },
  methods: {
    //============================小节操作================================
    //成功回调
    handleVodUploadSuccess(response, file, fileList) {
      // 上传视频ID赋值
      this.video.videoSourceId = response.data.videoId;
      // 上传视频名称赋值
      this.video.videoOriginalName = file.name;
    },
    // 删除视频提示
    beforeVodRemove(file,fileList){
     return this.$confirm(`是否确定删除${file.name}?`)
    },
    // 删除视频方法调用
    handleVodRemove(){
      video.deleteVodVideo(this.video.videoSourceId).then(response => {
        //提示信息
          this.$message({
            type: "success",
            message: "删除视频成功!",
          });
          //清空文件列表
          this.fileList = []
          //清空视频ID和视频名称
          this.video.videoSourceId = ''
          this.video.videoOriginalName = ''
      })
    },
    //视图上传多于一个视频
    handleUploadExceed(files, fileList) {
      this.$message.warning("想要重新上传视频，请先删除已上传的视频");
    },
    removeVideo(id) {
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        video.deleteVideo(id).then((response) => {
          //提示信息
          this.$message({
            type: "success",
            message: "删除小节成功!",
          });
          //刷新页面
          this.getChapterVideo();
        });
      });
    },
    //添加小节时的弹框方法
    openVideo(chapterId) {
      //弹框
      this.dialogVideoFormVisible = true;
      this.video.title = "";
      this.video.sort = 0;
      this.video.free = 0;
      this.video.videoSourceId = "";
      this.video.videoOriginalName = ""
      //设置章节ID
      this.video.chapterId = chapterId;
    },
    //添加小节
    addVideo() {
      //设置课程ID
      this.video.courseId = this.courseId;
      video.addVideo(this.video).then((response) => {
        //关闭弹框
        this.dialogVideoFormVisible = false;
        //提示信息
        this.$message({
          type: "success",
          message: "添加小节成功!",
        });
        //刷新页面
        this.getChapterVideo();
      });
    },
    //修改小节数据回显
    openEditVideo(id) {
      this.dialogVideoFormVisible = true;
      video.getVideo(id).then((response) => {
        this.video = response.data.video;
      });
    },
    //修改小节
    updateVideo() {
      video.updateVideo(this.video).then((response) => {
        //关闭弹框
        this.dialogVideoFormVisible = false;
        //提示信息
        this.$message({
          type: "success",
          message: "修改小节成功!",
        });
        //刷新页面
        this.getChapterVideo();
      });
    },
    //添加和修改小节
    saveOrUpdateVideo() {
      if (!this.video.id) {
        this.addVideo();
      } else {
        this.updateVideo();
      }
    },
    //============================章节操作================================
    removeChapter(chapterId) {
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        chapter.deleteChapter(chapterId).then((response) => {
          //提示信息
          this.$message({
            type: "success",
            message: "删除章节成功!",
          });
          //刷新页面
          this.getChapterVideo();
        });
      });
    },
    //修改章节信息中的数据回显
    openEditChapter(chapterId) {
      this.dialogChapterFormVisible = true;
      chapter.getChapter(chapterId).then((response) => {
        this.chapter = response.data.chapter;
      });
    },
    openChapterDialog() {
      // 打开弹框
      this.dialogChapterFormVisible = true;
      // 清空其中的数据
      this.chapter.title = "";
      this.chapter.sort = 0;
    },
    //添加章节
    addChapter() {
      this.chapter.courseId = this.courseId;
      //添加章节
      chapter.addChapter(this.chapter).then((response) => {
        //关闭弹框
        this.dialogChapterFormVisible = false;
        //提示信息
        this.$message({
          type: "success",
          message: "添加章节成功!",
        });
        //刷新页面
        this.getChapterVideo();
      });
    },
    updateChapter() {
      chapter.updateChapter(this.chapter).then((response) => {
        //关闭弹框
        this.dialogChapterFormVisible = false;
        //提示信息
        this.$message({
          type: "success",
          message: "修改章节成功!",
        });
        //刷新页面
        this.getChapterVideo();
      });
    },
    saveOrUpdate() {
      if (!this.chapter.id) {
        this.addChapter();
      } else {
        this.updateChapter();
      }
    },
    getChapterVideo() {
      chapter.getAllChapterVideo(this.courseId).then((response) => {
        this.chapterVideoList = response.data.list;
      });
    },
    previous() {
      this.$router.push({ path: "/course/info/" + this.courseId });
    },
    next() {
      this.$router.push({ path: "/course/publish/" + this.courseId });
    },
  },
};
</script>
<style scoped>
.chanpterList {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}
.chanpterList li {
  position: relative;
}
.chanpterList p {
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #ddd;
}
.chanpterList .acts {
  float: right;
  font-size: 14px;
}
.videoList {
  padding-left: 50px;
}
.videoList p {
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #ddd;
}
</style>