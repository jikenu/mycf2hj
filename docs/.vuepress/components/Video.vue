<template>
    <div style="display: flex; align-items: center; flex-direction: column;">
        <h1>Video Test</h1>

        <div class="video-container" v-for="item in video">
            <span style="font-size: x-large;">{{ item.name }}</span>
            <VidStack :src="item.link" width="80%" />
        </div>
    </div>

</template>

<script>
export default {
    props: {
        video: Array
    }
}
</script>
<style>
.video-container {
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;
    margin-top: 5%;
}

/* 暂未生效 */
.vds-button[data-active] .pip-enter-icon,
.vds-button:not([data-active]) .pip-exit-icon {
    display: none;
}
</style>