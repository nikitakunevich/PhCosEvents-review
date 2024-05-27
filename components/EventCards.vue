<script setup>
import { ref, onMounted, reactive } from 'vue'
import CtaWebinar from './partials/CtaWebinar.vue'
import CtaOffline from './partials/CtaOffline.vue'
import Tatiana from './partials/Tatiana.vue'
import Anastasia from './partials/Anastasia.vue'
import Filters from './partials/Filters.vue'
import Inna from './partials/Inna.vue'

import { useToast } from 'vue-toast-notification';
import Guzel from './partials/Guzel.vue'

const $toast = useToast()

const isExpanded = reactive([]);
const windowWidth = ref(0)
const props = defineProps(['data'])
const filterTab = ref('')
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

function toggleExpand(index) {
	//to toggle expand for each separate card in a list
	isExpanded[index] = isExpanded[index] ? !isExpanded[index] : true
}

function filterCards(tabName) {
	filterTab.value = tabName
}

function getEventDate(item) {
	const regEx = /(\d{2})\.(\d{2})\.(\d{2})/
	const parsedTime = item.time + ":00"
	const parsedDate = item.date.replace(regEx, "20$3-$2-$1")
	const eventTimeString = parsedDate + "T" + parsedTime + "+03:00"
	return new Date(eventTimeString)
}

/* Days difference counts on time, so floating number is possible. 
0 means that webinar takes place RIGHT NOW */
function countDaysDifference(item) {
	const daysDifference = (getEventDate(item).getTime() - currentDate.value) / (1000 * 3600 * 24) //Transform ms to Days
	return daysDifference
}

function isWebinar(item) {
	return item.place.toLowerCase() == 'онлайн' ? true : false
}

function hasEventPassed(item) {
	return countDaysDifference(item) < 0 ? true : false
}

function showWebinarCta(item) {
	return countDaysDifference(item) <= 7 && countDaysDifference(item) >= 0 && isWebinar(item) ? true : false
}

function showOfflineCta(item) {
	return !hasEventPassed(item) && !isWebinar(item) ? true : false
}

const copyLink = async (item) => {
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
						<CtaWebinar v-else-if="showWebinarCta(item)" :date="item.date" />

						<p v-if="isWebinar(item) && countDaysDifference(item) >= 7" class="text-grey-700">
							Регистрация на вебинар
							открывается за неделю до мероприятия</p>
						<p v-else-if="isWebinar(item) && countDaysDifference(item) < 0" class="text-grey-700">Вебинар
							уже
							прошёл
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
