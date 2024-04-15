import { defineStore } from 'pinia'

const layOutStateStore = defineStore('layOutStateStore', {
    state: () => ({
        homeHeader: true,//首页header
        homeFooter: true,//首页footer
        dreaws: false,//侧边栏
    }),

    actions: {
        dreawsToggle() {
            return this.dreaws = !this.dreaws
        }
    }
})


export default layOutStateStore