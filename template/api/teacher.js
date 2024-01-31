import request from '@/utils/request'
export default {
    //前台用户界面讲师分页
    getTeacherList(page,limit){
        return request({
            url: `/eduservice/teacherfront/page/${page}/${limit}`,
            method: 'post'
        })
    },
    //讲师详情页面信息
    getTeacherInfo(teacherId){
        return request({
            url: `/eduservice/teacherfront/getTeacherFrontInfo/${teacherId}`,
            method: 'get'
        })
    },
}