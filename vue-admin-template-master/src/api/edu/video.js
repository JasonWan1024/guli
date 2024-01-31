import request from '@/utils/request'

export default {
    //添加小节
    addVideo(video){
        return request({
            url: `/eduservice/video/addVideo`,
            method: 'post',
            data: video
        })
    },
    //根据小节ID查询所有章节信息
    getVideo(id){
        return request({
            url: `/eduservice/video/getVideo/${id}`,
            method: 'get'
        })
    },
    //修改小节信息
    updateVideo(video){
        return request({
            url: `/eduservice/video/updateVideo`,
            method: 'post',
            data: video
        })
    },
    //根据ID删除小节
    deleteVideo(id){
        return request({
            url: `/eduservice/video/deleteVideo/${id}`,
            method: 'delete'
        })
    },    
    //根据ID删除视频
    deleteVodVideo(videoId){
        return request({
            url: `/eduvod/video/delete/${videoId}`,
            method: 'delete'
        })
    },
}