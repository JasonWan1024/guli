import request from '@/utils/request'
export default {
    //前台用户界面课程带条件查询分页
    getCourseList(page,limit,courseFrontVo){
        return request({
            url: `/eduservice/coursefront/coursePage/${page}/${limit}`,
            method: 'post',
            data: courseFrontVo
        })
    },
    //获取所有一级二级分类
    getAllSubject(){
        return request({
            url: `/eduservice/subject/getAllSubject`,
            method: 'get'
        })
    },
    //根据课程ID获取课程的基本信息
    getCourseFrontInfo(courseId){
        return request({
            url: `/eduservice/coursefront/getCourseFrontInfo/${courseId}`,
            method: 'get'
        })
    },

}