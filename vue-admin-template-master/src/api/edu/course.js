import request from '@/utils/request'

export default {
    // 添加课程基本信息
    addCourseInfo(courseInfo){
        return request({
            url: '/eduservice/course/addCourse',
            method: 'post',
            data: courseInfo
        })
    },
    //通过课程id查询课程基本信息
    getCourseInfoById(courseId){
        return request({
            url: `/eduservice/course/getCourseInfo/${courseId}`,
            method: 'get'
        })
    },
    //修改课程基本信息
    updateCourseInfo(courseInfo){
        return request({
            url: `/eduservice/course/updateCourseInfo`,
            method: 'post',
            data: courseInfo
        })
    },
    //查询课程发布基本信息
    getPublishCourseInfo(id){
        return request({
            url: `/eduservice/course/getPublishCourseInfo/${id}`,
            method: 'get',
        })
    },
    //课程最终发布 将课程中的status设置为normal
    publishCourse(id){
        return request({
            url: `/eduservice/course/publishCourse/${id}`,
            method: 'post',
        })
    },
    //课程的条件查询待分页
    getCourseListPage(current,limit,courseQuery){
        return request({
            url: `/eduservice/course/pageCourseCondition/${current}/${limit}`,
            method: 'post',
            data: courseQuery
        })
    },
    removeCourse(id){
        return request({
            url: `/eduservice/course/deleteCourse/${id}`,
            method: 'delete',
        })
    }
}