<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import CtaWebinar from './partials/CtaWebinar.vue'
import CtaOffline from './partials/CtaOffline.vue'
import Tatiana from './partials/Tatiana.vue'
import Anastasia from './partials/Anastasia.vue'
import Filters from './partials/Filters.vue'
import Inna from './partials/Inna.vue'
import Guzel from './partials/Guzel.vue'

import { useToast } from 'vue-toast-notification';
const $toast = useToast()

const { data: landingDate, error } = await useFetch<string>(() => 'https://academy.phcos.ru/api/date.json')

interface Data {
	date: string,
	time: string,
	place: string,
	title: string,
	description: string,
	speaker: string,
	address?: string
}
const props = defineProps<{
	data: Data[]
}>()


const isExpanded = ref<boolean[]>([]);
const windowWidth = ref<number>(0)
const filterTab = ref<String>('')
const results = computed(() => {
	if (filterTab.value == 'Офлайн') {
		return props.data.filter(item => item.place.toLowerCase() != 'онлайн')
	}

	if (filterTab.value == 'Онлайн') {
		return props.data.filter(item => item.place.toLowerCase() == 'онлайн')
	}
	return props.data
})

let siteUrl = ref('')
const currentDate = computed(Date.now)

onMounted(() => {
	getWindowWidth()
	window.addEventListener('resize', getWindowWidth)
	siteUrl.value = window.location.origin
})

function getWindowWidth() {
	windowWidth.value = window.innerWidth
}

function toggleExpand(index: number) {
	//to toggle expand for each separate card in a list
	isExpanded.value[index] = isExpanded.value[index] ? !isExpanded.value[index] : true
}

function filterCards(tabName: string) {
	filterTab.value = tabName
}

function getEventDate(item: Data) {
	const regEx = /(\d{2})\.(\d{2})\.(\d{2})/
	const parsedTime = item.time + ":00"
	const parsedDate = item.date.replace(regEx, "20$3-$2-$1")
	const eventTimeString = parsedDate + "T" + parsedTime + "+03:00"
	return new Date(eventTimeString)
}

/* Days difference counts on time, so floating number is possible. 
0 means that webinar takes place RIGHT NOW */
function countDaysDifference(item: Data) {
	const daysDifference = (getEventDate(item).getTime() - currentDate.value) / (1000 * 3600 * 24) //Transform ms to Days
	return daysDifference
}

function hasEventPassed(item: Data) {
	return countDaysDifference(item) < 0 ? true : false
}

function isWebinar(item: Data) {
	return item.place.toLowerCase() == 'онлайн' ? true : false
}

function showWebinarCta(item: Data) {
	if ((new Date(landingDate.value!).getTime() == getEventDate(item).getTime())
		&& !hasEventPassed(item)
		&& isWebinar(item)) {
		return true
	} else {
		return false
	}
}

function showOfflineCta(item: Data) {
	return !hasEventPassed(item) && !isWebinar(item) ? true : false
}

const copyLink = async (item: Data) => {
	const cardLink = siteUrl.value + '#event-' + item.date
	try {
		await navigator.clipboard.writeText(cardLink);
		$toast.success('Cсылка скопирована!')
	} catch (err) {
		$toast.error('Ошибка копирования. Попробуйте еще раз')
	}
}
</script>

<template>
	<Filters @tab-selected="filterCards" :places="props.data.map(item => item.place)" />
	<TransitionGroup name="cards">
		<section v-for="(item, index) in results"
			:key="item.date"
			:class="[(index % 2) != 0 ? 'bg-main-100' : '']"
			class="max-w-screen-container mx-auto border rounded border-main-200 p-3 tablet:p-6 grid desktop:grid-cols-2 desktop:gap-4"
			:id="'event-' + item.date">
			<div class="flex flex-row justify-between col-span-full">
				<div class="flex flex-col desktop:flex-row gap-1 desktop:gap-4 desktop:mb-6">
					<p class="text-sm tablet:text-lg font-medium text-grey-800">{{ item.date }}</p>
					<p class="text-sm tablet:text-lg font-normal text-grey-800">{{ item.time }} МСК</p>
				</div>
				<p class="text-grey-800 tablet:text-lg text-sm">{{ item.place }}</p>
			</div>
			<div class="">
				<h2 class="mt-2 text-grey-900 text-lg tablet:text-2xl font-medium mb-4">{{ item.title }}</h2>
				<Transition>
					<div v-show="isExpanded[index] || windowWidth > 768">
						<ul class="description flex flex-col list-disc list-outside pl-4 gap-2 description desktop:text-lg text-grey-800"
							v-html="item.description"></ul>
						<button @click.prevent="copyLink(item)"
							class="text-main-600 font-medium text-left mt-4">Скопировать ссылку</button>
					</div>

				</Transition>
			</div>
			<Transition>
				<div v-show="isExpanded[index] || windowWidth > 768" class="flex flex-col gap-6">
					<Tatiana v-if="item.speaker == 'tatiana'" />
					<Anastasia v-else-if="item.speaker == 'anastasia'" />
					<Inna v-else-if="item.speaker == 'inna'" />
					<Guzel v-else-if="item.speaker == 'guzel'" />
					<div>
						<div class="flex flex-col mb-3">
							<p class="text-sm tablet:text-base  text-grey-700">Место проведения</p>
							<h3 class="text-lg  tablet:text-2xl font-medium text-grey-900 capitalize">
								{{ isWebinar(item) ? 'Онлайн' : item.place }}</h3>
						</div>
						<p v-if="!isWebinar(item)" class="text-grey-800">{{ item.address }}</p>


						<CtaOffline v-if="showOfflineCta(item)" :place="item.place" :date="item.date" />
						<CtaWebinar v-if="showWebinarCta(item)" :date="item.date" />
						<p v-if="!showWebinarCta(item) && !showOfflineCta(item) && !hasEventPassed(item)"
							class="text-grey-700">Мы
							подготоваливаем
							вебинар к анонсу! Регистрация
							откроется в
							ближайшее время
						</p>
					</div>
				</div>
			</Transition>
			<div @click="toggleExpand(index)" class="text-main-600 tablet:text-lg font-medium desktop:hidden mt-6">{{
				isExpanded[index] ? 'Закрыть' : 'Подробнее'
			}}</div>
		</section>
	</TransitionGroup>
</template>

<style lang="css">
.cards-enter-active,
.cards-leave-active {
	transition: all 0.4s ease-in-out;
}

.cards-enter-from,
.cards-leave-to {
	opacity: 0;
}


@media (width < 768px) {

	.v-enter-active,
	.v-leave-active {
		transition: 0.5s ease;
	}

	.v-enter-from,
	.v-leave-to {
		opacity: 0;
		transform: translateY(-5%);
	}
}
</style>
