import request from '@/utils/request'


export default {
    // 获取讲师列表（分页查询）
    // 方法的参数应该和后端接口方法的参数相对应
    getTeacherListPage(current, limit, teacherQuery){
        return request({
            // 此处路径和后端接口方法的路径对应
            // 需要拼接参数时用 `` 和 ${}解决
            url: `/eduservice/teacher/pageTeacherCondition/${current}/${limit}`,
            method: 'post',
            // 此处需要用data: 标签 因为后端teacherQuery使用了@RequestBody获取json数据
            // 前端需要用data: 给后端返回json数据 data: 会将对象转换成json数据
            data: teacherQuery
          })
    },
    //根据ID删除教师
    deleteTeacherId(id){
        return request({
            url: `/eduservice/teacher/delete/${id}`,
            method: 'delete',
        })
    },
    //添加教师
    addTeacher(teacher){
        return request({
            url: '/eduservice/teacher/addTeacher',
            method: 'post',
            data: teacher
        })
    },
    //根据ID查询教师
    getTeacherInfo(id){
        return request({
            url: `/eduservice/teacher/getTeacher/${id}`,
            method: 'get',
        })
    },
    //修改讲师信息
    updateTeacherInfo(teacher){
        return request({
            url: `/eduservice/teacher/updateTeacher`,
            method: 'post',
            data: teacher
        })
    },
    //查询所有教师数据
    getTeacherList(){
        return request({
            url: '/eduservice/teacher/findAll',
            method: 'get',
        })
    },
        
}
