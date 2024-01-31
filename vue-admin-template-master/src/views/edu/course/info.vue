<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>
    <el-steps
      :active="1"
      process-status="wait"
      align-center
      style="margin- bottom: 40px;"
    >
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="最终发布" />
    </el-steps>
    <el-form label-width="120px">
      <el-form-item label="课程标题">
        <el-input
          v-model="courseInfo.title"
          placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"
        />
      </el-form-item>
      <!-- 所属分类 TODO -->
      <el-form-item label="课程分类">
        <el-select
          v-model="courseInfo.subjectParentId"
          placeholder="一级分类"
          @change="subjectLevelOneChanged"
        >
          <el-option
            v-for="subject in subjectOneList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
        <el-select v-model="courseInfo.subjectId" placeholder="二级分类">
          <el-option
            v-for="subject in subjectTwoList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
      </el-form-item>
      <!-- 课程讲师 TODO -->
      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select v-model="courseInfo.teacherId" placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="总课时">
        <el-input-number
          :min="0"
          v-model="courseInfo.lessonNum"
          controls-position="right"
          placeholder="请填写课程的总课时数"
        />
      </el-form-item>
      <!-- 课程简介 TODO -->
      <!-- 课程简介-->
      <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description" />
      </el-form-item>
      <!-- 课程封面 TODO -->
      <!-- 课程封面-->
      <el-form-item label="课程封面">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API + '/eduoss/fileoss'"
          class="avatar-uploader"
        >
          <img :src="courseInfo.cover" style="width: 200px; height: 180px" />
        </el-upload>
      </el-form-item>
      <el-form-item label="课程价格">
        <el-input-number
          :min="0"
          v-model="courseInfo.price"
          controls-position="right"
          placeholder="免费课程请设置为0元"
        />
        元
      </el-form-item>
      <el-form-item>
        <el-button
          :disabled="saveBtnDisabled"
          type="primary"
          @click="saveOrUpdate"
          >保存并下一步</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import course from "@/api/edu/course";
import subject from "@/api/edu/subject";
import Tinymce from "@/components/Tinymce";
import teacher from "@/api/edu/teacher";
export default {
  components: { Tinymce },
  data() {
    return {
      saveBtnDisabled: false,
      courseInfo: {
        title: "",
        subjectId: "",
        subjectParentId: "",
        teacherId: "",
        lessonNum: 0,
        description: "",
        cover: "/static/11.jpg",
        price: 0,
      },
      BASE_API: process.env.BASE_API, // 接口API地址
      courseId: "",
      teacherList: [],
      subjectOneList: [],
      subjectTwoList: [],
    };
  },
  created() {
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id;
      this.getCourseInfo();
    } else {
      this.getAllSubjectInfo();
      this.getTeacherListInfo();
    }
  },
  watch: {
      $route(to, from) {
        this.courseInfo = ''
      }
  },
  methods: {
    getCourseInfo() {
      course.getCourseInfoById(this.courseId).then((response) => {
        // 获取courseInfo课程的基本信息 包含一级分类ID和二级分类ID
        this.courseInfo = response.data.courseInfoVo;
        subject.getAllSubject().then((response) => {
          // 获取返回的所有一级分类 其中包含二级分类
          this.subjectOneList = response.data.list;
          // 遍历所有一级分类
          for (var i = 0; this.subjectOneList.length; i++) {
            // 获取所有一级分类
            var oneSubject = this.subjectOneList[i];
            // 判断courseInfo中的一级分类ID是否和所有的一级分类ID相同
            if (this.courseInfo.subjectParentId == oneSubject.id) {
              // 获取一级分类中的所有二级分类
              this.subjectTwoList = oneSubject.children;
            }
          }
        });
      });
      this.getTeacherListInfo();
    },
    handleAvatarSuccess(res, file) {
      this.courseInfo.cover = res.data.url;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },

    // 点击某个一级分类 触发change事件 显示对应的二级事件
    // value可以直接拿到一级分类的id
    subjectLevelOneChanged(value) {
      // 使用for循环遍历subjectOneList获取所有一级二级分类的数据
      for (var index = 0; index < this.subjectOneList.length; index++) {
        // 将一级分类数据返回
        var oneSubject = this.subjectOneList[index];
        // 判断一级分类id是否相等
        if (value === oneSubject.id) {
          // 将二级分类数据赋值给subjectTwoList
          this.subjectTwoList = oneSubject.children;
          // 每次点击一级分类的时候 将二级分类的数据清空
          this.courseInfo.subjectId = "";
        }
      }
    },
    getAllSubjectInfo() {
      subject.getAllSubject().then((response) => {
        this.subjectOneList = response.data.list;
      });
    },
    getTeacherListInfo() {
      teacher.getTeacherList().then((response) => {
        this.teacherList = response.data.items;
      });
    },
    //添加课程信息
    addCourse(){
      course.addCourseInfo(this.courseInfo).then((response) => {
        //提示信息
        this.$message({
          type: "success",
          message: "添加课程基本信息成功!",
        });
        this.$router.push({
          path: "/course/chapter/" + response.data.courseId,
        });
      });
    },
    //修改课程信息
    updateCourse(){
      course.updateCourseInfo(this.courseInfo).then((response) => {
        //提示信息
        this.$message({
          type: "success",
          message: "修改课程基本信息成功!",
        });
        this.$router.push({
          path: "/course/chapter/" + this.courseId,
        });
      });
    },
    saveOrUpdate() {
      //判断courseinfo中是否有ID 没有则为添加
      if(!this.courseInfo.id){
        this.addCourse()
      }else{
        this.updateCourse()
      }
    },
  },
};
</script>
<style scoped>
.tinymce-container {
  line-height: 29px;
}
</style>