<script setup>
const { data } = await useAsyncData('data', () => queryContent().findOne());
const sortedByDate = data.value.body.sort((a, b) => (a.date > b.date) ? 1 : (a.date < b.date) ? -1 : 0)
useSeoMeta({
  title: 'Общее расписание на ' + data.value.title.toLowerCase(),
  description: 'Общее расписание обучающих семинаров и вебинаров компании Фармацевтикал Косметик',
});
</script>

<template>
  <Body>
    <Header />
    <main class='flex flex-col gap-6 desktop:gap-8 px-4 tablet:px-6 mb-12 desktop:mb-20'>
      <h1
        class='text-3xl desktop:text-4xl font-medium text-center text-main-800 mt-12 mb-4 tablet:mb-6 desktop:mt-16'>
        <span class="capitalize">{{ data.title }}</span> 2024 года
      </h1>
      <EventCards :data="sortedByDate" />
    </main>
    <Footer />
  </Body>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
</style>
