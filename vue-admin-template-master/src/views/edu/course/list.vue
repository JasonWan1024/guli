<template>
  <div class="app-container">
    课程列表
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <!-- 此处使用v-model和方法中的teacherQuery进行双向绑定 实现值共享-->
        <el-input v-model="courseQuery.title" placeholder="课程名称" />
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="courseQuery.status"
          clearable
          placeholder="课程状态"
        >
          <el-option value="Normal" label="已发布" />
          <el-option value="Draft" label="未发布" />
        </el-select>
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="getList()"
        >查 询</el-button
      >
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>
    <el-table
      :data="list"
      element-loading-text="数据加载中"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="title" label="课程名称" width="160" />

      <el-table-column label="课程状态" width="80">
        <template slot-scope="scope">
          {{ scope.row.status === "Normal" ? "已发布" : "未发布" }}
        </template>
      </el-table-column>

      <el-table-column prop="lessonNum" label="课时数" width="160" />

      <el-table-column prop="gmtCreate" label="添加时间" width="160" />

      <el-table-column prop="viewCount" label="浏览数量" width="160" />
        <!-- 此处跳转有bug 新加入的数据可以正常跳转修改 数据库中的老数据跳转会报错 -->
      <el-table-column label="操作" style="margin-botton: 5px" align="center">
        <template slot-scope="scope">
          <router-link :to="'/course/info/' + scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit"
              >编辑课程基本信息</el-button
            >
          </router-link>
          <router-link :to="'/course/chapter/' + scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit"
              >编辑课程大纲</el-button
            >
          </router-link>
          <!-- 使用scope.row.id 获取课程的id -->
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeDataById(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center"
      layout="total, prev, pager, next, jumper"
      @current-change="getList"
    />
  </div>
</template>
<script>
import course from "@/api/edu/course";

export default {
  //写核心代码位置
  //定义变量和初始值
  data() {
    return {
      list: null, // 查询之后接口返回集合
      page: 1, // 当前页
      limit: 10, // 每页记录数
      total: 0, // 总记录数
      courseQuery: {
        title: "",
        status: "",
      }, //条件对象
    };
  },
  //调用methods中的方法
  created() {
    //调用的方法一定要加() 否则无法调用
    this.getList();
  },
  //主要方法的具体实现
  methods: {
    getList(page = 1) {
      this.page = page;
      course
        .getCourseListPage(this.page, this.limit, this.courseQuery)
        .then((response) => {
          // console.log(response)
          this.list = response.data.rows;
          this.total = response.data.total;
          //   console.log(this.list);
          //   console.log(this.total);
        });
    },
    //清空的方法
    resetData() {
      //清空选项条中的所有数据
      this.courseQuery = {};
      //重新查询所有数据
      this.getList();
    },
    removeDataById(id) {
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        // 点击确定执行then方法
        // 调用后端的删除方法
        course.removeCourse(id).then((response) => {
          //给用户展示提示信息
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          //重新获取课程列表
          this.getList();
        });
      });
    },
  },
};
</script>