import { defineClientConfig } from "vuepress/client";
import Audio from './components/Audio.vue';
import Video from './components/Video.vue'

export default defineClientConfig({
    enhance: ({ app, router, siteData }) => {
      app.component("Audio", Audio);
      app.component("Video",Video);
    },
  });