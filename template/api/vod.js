import request from '@/utils/request'
export default {
    //根据视频id获取视频凭证
    getPlayAuth(id){
        return request({
            url: `/eduvod/video/getPlayAuth/${id}`,
            method: 'get'
        })
    },
}