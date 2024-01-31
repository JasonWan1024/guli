import request from '@/utils/request'
export default {
    //获取热门课程和名师信息
    getIndexData() {
        return request({
            url: `/eduservice/indexfront/index`,
            method: 'get'
        })
    }
}