<template>
  <q-select
    outlined
    v-bind="$attrs"
    v-model="content"
    :multiple="isMultiple"
    :options="options"
    :rules="[(val) => !isRequired || !!val]"
  >
    <template v-slot:option="scope">
      <q-item v-bind="scope.itemProps">
        <!-- <q-item> -->
        <doc-renderer
          :name="scope.opt"
          :content="collection.get(scope.opt)"
          :avatarParser="avatarParser"
        />

        <!-- </q-item> -->
      </q-item>
    </template>
    <template v-slot:selected-item="scope">
      <template v-if="isMultiple">
        <q-chip
          class="q-ml-none q-mr-sm"
          removable
          @remove="scope.removeAtIndex(scope.index)"
        >
          <doc-renderer
            :content="collection?.get(scope.opt)"
            :avatarParser="avatarParser"
            :name="scope.opt"
            chip
            v-slot="{ avatar, displayName }"
          >
            <q-avatar v-if="avatar?.url">
              <q-img :src="avatar.url" />
            </q-avatar>

            {{ displayName }}
          </doc-renderer>
        </q-chip>
      </template>

      <q-item class="q-pl-none" v-else>
        <doc-renderer
          :name="scope.opt"
          :content="collection.get(scope.opt)"
          :avatarParser="avatarParser"
        />
      </q-item>
    </template>
  </q-select>
  {{ options }}
  {{ docList.length }}
</template>

<script lang="ts">
import { defineComponent, computed, ref, PropType, watchEffect } from "vue";
import { AvatarParser, Document } from "../interfaces";
import DocRenderer from "../renderers/DocRenderer.vue";

export default defineComponent({
  components: { DocRenderer },
  name: "SelectDocInput",
  props: {
    modelValue: {} as PropType<string | string[]>,
    isMultiple: Boolean,
    isRequired: Boolean,
    collection: {} as PropType<Map<string, Document>>,
    avatarParser: {} as PropType<AvatarParser>,
  },
  setup(props, { emit }) {
    const content = computed({
      get: () =>
        !props.isMultiple || Array.isArray(props.modelValue)
          ? props.modelValue
          : [],
      set: (value) => {
        emit("update:modelValue", value);
      },
    });
    const options = ref<string[]>([]);
    const docList = ref<Document[]>([]);

    watchEffect(() => {
      if (props.collection == undefined) {
        options.value = [];
        return;
      }
      docList.value = [...props.collection.values()];
      options.value = [...props.collection.keys()];
    });

    return { options, content, docList };
  },
});
</script>
