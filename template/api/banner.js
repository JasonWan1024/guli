import request from '@/utils/request'
export default {
    //获取首页轮播图
    getList() {
        return request({
            url: `/educms/bannerfront/getAllBanner`,
            method: 'get'
        })
    }
}