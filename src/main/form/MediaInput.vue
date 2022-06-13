<template>
  <q-item class="q-pt-none q-pa-none bg-red">
    <q-item-section v-if="!noImg && modelValue" avatar>
      <image-renderer :content="modelValue" />
    </q-item-section>
    <q-item-section>
      <q-file
        v-model="uploadFile"
        type="file"
        :label="label"
        dense
        v-bind="$attrs"
      />
    </q-item-section>
    <q-item-section side>
      <q-spinner v-if="isLoading"></q-spinner>
      <boolean-renderer v-else :content="uploadStatus" />
    </q-item-section>
    <q-item-section side>
      <q-btn
        :disabled="!uploadFile || uploadStatus"
        @click="upload"
        label="Upload"
        color="primary"
      />
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import {
  getStorage,
  ref as reference,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { defineComponent, ref, computed, watch } from "vue";
import BooleanRenderer from "../renderers/BooleanRenderer.vue";
import ImageRenderer from "../renderers/ImageRenderer.vue";
import { date } from "quasar";
import { File } from "../interfaces";

/** Provides information about files and allows JavaScript in a web page to access their content. */

export default defineComponent({
  name: "MediaInput",
  components: { BooleanRenderer, ImageRenderer },
  props: {
    label: { type: String, default: "Select file" },
    modelValue: String,
    fieldPath: String,
    uploadPath: String,
    noImg: Boolean,
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const uploadFile = ref<File>();
    const isLoading = ref<boolean>(false);
    const uploadStatus = ref<boolean>();
    const storage = getStorage();
    const path = computed(() =>
      (props.uploadPath || ":path/:date-:name")
        .replace(/:path\b/, props.fieldPath || "")
        .replace(/:date\b/, date.formatDate(Date.now(), "YYYYMMDD-HHMMSS"))
        .replace(/:name\b/, uploadFile.value?.name || "")
    );
    watch(uploadFile, () => {
      uploadStatus.value = false;
      isLoading.value = false;
    });
    async function upload() {
      if (!uploadFile.value) return;
      if (uploadStatus.value) return;

      isLoading.value = true;
      uploadStatus.value = false;
      try {
        const storageRef = reference(storage, path.value);
        const res = await uploadBytes(storageRef, uploadFile.value);
        const mediaUrl = await getDownloadURL(res.ref);
        emit("update:modelValue", mediaUrl);

        uploadStatus.value = true;
      } finally {
        isLoading.value = false;
      }
    }

    return { isLoading, uploadFile, uploadStatus, upload, path };
  },
});
</script>
