import gsap from "gsap"
import { ramEase } from "../../utils/animate"


const onBeforeEnter = (el) => {
    gsap.set(el, {
        opacity: 0,
        x: '-30%'
    })
}


const onEnter = (el, done) => {
    gsap.to(el, {
        opacity: 1,
        ease: ramEase(),
        duration: .5,
        x: 0,
        onComplete: done
    })
}

const onLeave = (el, done) => {
    gsap.to(el, {
        ease: ramEase(),
        opacity: 0,
        duration: .55,
        x: '102%',
        onComplete: done
    })
}

export {
    onLeave, onEnter, onBeforeEnter
}