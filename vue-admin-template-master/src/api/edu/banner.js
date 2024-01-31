import request from '@/utils/request'

export default {
    //分页查询banner
    pageBanner(page,limit){
        return request({
            url: `/educms/banneradmin/pageBanner/${page}/${limit}`,
            method: 'get'
        })
    },
    // 添加banner
    addBanner(){
        return request({
            url: `/educms/banneradmin/addBanner`,
            method: 'post'
        })
    },
    // 获取banner
    getBanner(id){
        return request({
            url: `/educms/banneradmin/getBanner/${id}`,
            method: 'get'
        })
    },
    // 修改banner
    updateBanner(crmBanner){
        return request({
            url: `/educms/banneradmin/updateBanner`,
            method: 'put',
            data: crmBanner
        })
    },
    // 删除banner
    deleteBanner(id){
        return request({
            url: `/educms/banneradmin/deleteBanner/${id}`,
            method: 'delete'
        })
    },
}