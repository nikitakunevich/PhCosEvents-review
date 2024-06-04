<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
    places: string[]
}>()
const emit = defineEmits<{
    tabSelected: [tab: string]
}>()

const activeTab = ref<string>('Все')


const placesOnline = props.places.filter((item) => item === 'Онлайн' || item === 'онлайн');
const placesOffline = props.places.length - placesOnline.length

function handleClick(tab: string) {
    activeTab.value = tab
    emit('tabSelected', tab)
}


function countPlaces(tab: string) {
    if (tab === 'Онлайн') {
        return placesOnline.length
    } else if (tab === 'Офлайн') {
        return placesOffline
    } else {
        return props.places.length
    }

}

</script>

<template>
    <div class="max-w-screen-desktop mx-auto border-b border-b-grey-200">
        <ul class="-mb-px flex items-center gap-4 text-sm font-medium">
            <li class="flex-1" v-for="tab in ['Все', 'Онлайн', 'Офлайн']">
                <button
                    type="button"
                    @click.prevent="handleClick(tab)"
                    :key="tab"
                    :class="[activeTab == tab ? ['text-main-700', 'after:bg-main-700'] : ['text-grey-500', 'after:bg-grey-500']]"
                    class="transition relative flex items-center justify-center gap-2 px-1 py-3 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full hover:text-main-700">
                    {{ tab }}<span
                        class="rounded-full bg-grey-100 px-2 py-0.5 text-xs font-semibold text-grey-500">{{ countPlaces(tab) }}
                    </span></button>
            </li>
        </ul>
    </div>
</template>