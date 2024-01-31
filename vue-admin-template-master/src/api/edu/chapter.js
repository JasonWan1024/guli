import request from '@/utils/request'

export default {
    // 根据课程id获取所有章节和小节
    getAllChapterVideo(courseId){
        return request({
            url: `/eduservice/chapter/getChapterVideo/${courseId}`,
            method: 'get'
        })
    },
    //添加章节
    addChapter(chapter){
        return request({
            url: `/eduservice/chapter/addChapter`,
            method: 'post',
            data: chapter
        })
    },
    //根据章节ID查询所有章节信息
    getChapter(chapterId){
        return request({
            url: `/eduservice/chapter/getChapterInfo/${chapterId}`,
            method: 'get'
        })
    },
    //修改章节信息
    updateChapter(chapter){
        return request({
            url: `/eduservice/chapter/updateChapter`,
            method: 'post',
            data: chapter
        })
    },
    //根据ID删除章节
    deleteChapter(chapterId){
        return request({
            url: `/eduservice/chapter/deleteChapter/${chapterId}`,
            method: 'delete'
        })
    },
}