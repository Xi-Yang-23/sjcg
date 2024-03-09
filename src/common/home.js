import { ref, computed } from "vue";
import { useQuasar } from "quasar";

const slide = ref(1);

const carouselStyle = computed(() => {
    const $q = useQuasar();

    const gtXs = $q.screen.gt.xs,
        height = gtXs ? "320px" : "166px",
        width = gtXs ? "500px" : "100%";


    return {
        width,
        height,
    };
});


export {
    carouselStyle, 
    slide,
}