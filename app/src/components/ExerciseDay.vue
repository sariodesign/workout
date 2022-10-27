<template>
    <div class="switcher" :class="{ active: isActive }" @click="activeDay">
        <div class="switch-item" v-for="(item, index) in days" :class="{ current : item.current }" :data-day="item.day" @click="currentDay" :key="index">{{ item.label }}</div>
    </div>
</template>

<script>
export default {
  name: "ExerciseDay",
  data() {
    let days = [
        {
            label: "Primo allenamento",
            day: 'one',
            current: true
        },
        {
            label: "Secondo allenamento",
            day: 'two',
            current: false
        },
        {
            label: "Terzo allenamento",
            day: 'three',
            current: false
        },
        {
            label: "Quarto allenamento",
            day: 'four',
            current: false
        },
        {
            label: "Quinto allenamento",
            day: 'five',
            current: false
        }
    ];
    
    return {
        isActive: false,
        days,
    };
  },
  methods: {
    activeDay() {
        this.isActive = !this.isActive
    },
    currentDay(e) {
        let daySelect = e.target.dataset.day;
        let indexDay = this.days.map(item => item.label).indexOf(e.target.textContent)
        this.days.forEach(item => item.current = false)
        this.days[indexDay].current = true
        let dayListSelected = document.querySelector(".card-container[data-day=" + daySelect + "]");
        dayListSelected.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
        });
    }
  },
};
</script>

<style>
    .switcher {
        background-color: transparent;
        bottom: 110px;
        height: 40px;
        position: fixed;
        right: 20px;
        width: 50%;
        z-index: 2;
    }

    .switcher.active {
        display: flex;
        flex-direction: column-reverse;
    }

    .switcher.active .switch-item {
        opacity: 1;
        position: relative;
        pointer-events: all;
    }

    .switcher.active .switch-item:nth-child(3) {    
        transition-delay: .1s;
    }
    
    .switcher.active .switch-item:nth-child(4) {
        transition-delay: .15s;
    }

    .switch-item {
        background-color: #42b983;
        box-sizing: border-box;
        color: #fff;
        align-items: center;
        display: flex;
        flex: 1 0 auto;
        justify-content: center;
        height: 100%;
        left: 0;
        margin-bottom: 4px;
        opacity: 0;
        order: 1;
        position: absolute;
        pointer-events: none;
        transition: all .2s ease-in-out;
        top: 0;
        width: 100%;
        z-index: 0;
    }

    .current {
        background-color: #fff;
        border: 2px solid #42b983;
        color: #42b983;
        opacity: 1;
        z-index: 1;     
        order: 0;   
    }

</style>