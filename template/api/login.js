import request from '@/utils/request'
export default {
    //登录
    login(user){
        return request({
            url: `/educenter/member/login`,
            method: 'post',
            data: user
        })
    },
    getMemberInfo(){
        return request({
            url: `/educenter/member/getMemberInfo`,
            method: 'get'
        })
    },
}