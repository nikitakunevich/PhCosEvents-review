<script setup>
const props = defineProps({
	place: {
		type: String,
		required: true
	},
	date: {
		type: String,
		required: true
	}
});

//Adjust if two parallel landings running
const contactLink = computed(() => {
	if (props.place.toLowerCase() == 'москва') {
		return "https://wa.me/+79895726455"
	}
});

const text = "?text=Здравствуйте!%20Я%20хочу%20зарегистрироваться%20на%20семинар%20"

const messageText = computed(() => {
	return contactLink.value + text + props.date
});
</script>

<template>
	<p class="text-grey-700 mt-4">Напишите менеджеру для записи на семинар!</p>
	<a target="_blank" :href="messageText">
		<button
			type="button"
			class="flex flex-row justify-center w-full text-center mt-2 rounded-md cursor-pointer text-white bg-green-600 py-2 px-4 hover:bg-green-700 transition duration-200 ease-in">
			Написать в WhatsApp</button>
	</a>
</template>
