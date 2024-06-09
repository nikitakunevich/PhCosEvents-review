<script setup lang="ts">
const props = defineProps({
	date: {
		type: String,
		required: true
	}
});

//Adjust if two parallel landings running
const landingLink = computed(() => {
	if (props.date == '30.05.24') {
		return "https://webinar.phcos.ru"
	} else {
		return "https://academy.phcos.ru"
	}
});

</script>

<template>
	<a :href="landingLink">
		<button
			type="button"
			class="flex flex-row justify-center w-full text-center rounded-md bg-main-500 cursor-pointer text-white py-2 px-4 hover:bg-main-700 transition duration-200 ease-in">
			Зарегистрироваться</button>
	</a>
</template>
